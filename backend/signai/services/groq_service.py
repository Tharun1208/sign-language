"""
Groq LLM Service for Sign Language Sentence Refinement.

Converts sequences of recognized sign-language words and letters into
natural, context-aware, grammatically correct sentences.

Preserves the original meaning without hallucinations, handles duplicate
predictions from camera frames, and provides graceful fallbacks if the
API key is unset or an API error occurs.
"""

import os
import re
import logging
from typing import Dict, List, Optional, Tuple, Union

from .. import config

logger = logging.getLogger("signai.groq")

# System prompt adhering strictly to translation guidelines
GROQ_SYSTEM_PROMPT = """You are an expert Sign Language to Natural Language Translation Assistant.
Your task is to take a sequence of sign-language words or fingerspelled tokens recognized by a deep learning computer vision model and reconstruct them into a clear, natural, grammatically correct English sentence.

Strict Guidelines:
1. Preserve the exact intended meaning of the recognized signs. Do not add external facts, assumptions, or extra details that were not in the signs.
2. Fix fragmented syntax, tense, and missing grammatical function words (such as prepositions, auxiliary verbs, or articles) to form a fluent sentence.
3. Clean up accidental adjacent duplicate words or letters caused by continuous frame detections (e.g., "I I NEED WATER" -> "I need water.").
4. If the input represents a question (e.g., "YOU HELP ME" or "WHERE RESTROOM"), format it as a natural, polite question (e.g., "Can you help me?", "Where is the restroom?").
5. If the input is incomplete or consists of only one or two signs, output the best minimal natural phrase without hallucinating a full story.
6. Return ONLY the final translated sentence. Do not include commentary, explanations, quotes, prefixes, or disclaimers.
"""


def clean_and_deduplicate_tokens(raw_tokens: Union[str, List[str]]) -> Tuple[str, List[str]]:
    """
    Sanitize recognized sign input.
    Collapses multiple whitespaces and reduces immediate consecutive duplicates.
    Example: ['I', 'I', 'NEED', 'WATER', 'WATER'] -> ('I NEED WATER', ['I', 'NEED', 'WATER'])
    """
    if isinstance(raw_tokens, str):
        # Normalize whitespace
        text = re.sub(r"\s+", " ", raw_tokens).strip()
        tokens = text.split(" ") if text else []
    else:
        tokens = [str(t).strip() for t in raw_tokens if str(t).strip()]

    # Deduplicate consecutive identical tokens
    deduped: List[str] = []
    for token in tokens:
        if not deduped or deduped[-1].upper() != token.upper():
            deduped.append(token)

    joined_text = " ".join(deduped).strip()
    return joined_text, deduped


def generate_fallback_sentence(text: str) -> str:
    """
    Construct a clean fallback sentence when Groq is unavailable.
    Applies standard capitalization and punctuation without altering meaning.
    """
    cleaned = text.strip()
    if not cleaned:
        return ""

    # Capitalize the first letter and keep the rest readable
    words = cleaned.split()
    sentence = " ".join(words)

    # Basic capitalization
    sentence = sentence[0].upper() + (sentence[1:].lower() if len(sentence) > 1 else "")

    # Ensure punctuation at the end
    if sentence and sentence[-1] not in {".", "?", "!"}:
        sentence += "."

    return sentence


def refine_sentence(
    raw_input: Union[str, List[str]],
    model: Optional[str] = None,
    api_key: Optional[str] = None,
) -> Dict[str, Union[str, bool, None]]:
    """
    Process recognized sign tokens using Groq API.

    Returns:
        dict: {
            "success": bool,
            "original_text": str,
            "refined_sentence": str,
            "ai_generated": bool,
            "model": str or None,
            "status": str,
            "message": str
        }
    """
    normalized_text, deduped_tokens = clean_and_deduplicate_tokens(raw_input)

    if not normalized_text:
        return {
            "success": True,
            "original_text": "",
            "refined_sentence": "",
            "ai_generated": False,
            "model": None,
            "status": "empty_input",
            "message": "No recognized words provided.",
        }

    active_api_key = (api_key or config.GROQ_API_KEY).strip()
    target_model = (model or config.GROQ_MODEL or "llama-3.3-70b-versatile").strip()
    fallback = generate_fallback_sentence(normalized_text)

    # Check if API key is present
    if not active_api_key:
        return {
            "success": True,
            "original_text": normalized_text,
            "refined_sentence": fallback,
            "ai_generated": False,
            "model": None,
            "status": "unconfigured_key",
            "message": "Groq API key not configured. Set GROQ_API_KEY in backend/.env to enable AI sentence refinement.",
        }

    try:
        from groq import Groq, APIConnectionError, RateLimitError, APIStatusError

        client = Groq(api_key=active_api_key, timeout=config.GROQ_TIMEOUT)

        user_content = f"Recognized sign tokens: {normalized_text}"

        candidate_models = [target_model]
        for fallback_model in ["qwen/qwen3.8-27b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile", "llama-3.1-8b-instant"]:
            if fallback_model not in candidate_models:
                candidate_models.append(fallback_model)

        chat_completion = None
        used_model = target_model
        last_error = None

        for model_candidate in candidate_models:
            try:
                chat_completion = client.chat.completions.create(
                    model=model_candidate,
                    messages=[
                        {"role": "system", "content": GROQ_SYSTEM_PROMPT},
                        {"role": "user", "content": user_content},
                    ],
                    temperature=0.3,
                    max_tokens=150,
                )
                used_model = model_candidate
                break
            except Exception as candidate_err:
                last_error = candidate_err
                err_msg = str(candidate_err).lower()
                if "model_not_found" in err_msg or "does not exist" in err_msg or "access" in err_msg:
                    continue
                else:
                    raise candidate_err

        if chat_completion is None:
            if last_error:
                raise last_error
            refined = fallback
        else:
            response_content = chat_completion.choices[0].message.content or ""
            refined = response_content.strip()

        # Remove accidental surrounding quotes or markdown asterisks
        if (refined.startswith('"') and refined.endswith('"')) or (
            refined.startswith("'") and refined.endswith("'")
        ):
            refined = refined[1:-1].strip()

        if refined.startswith("**") and refined.endswith("**") and len(refined) > 4:
            refined = refined[2:-2].strip()

        # If model returned an empty string, fallback
        if not refined:
            refined = fallback

        return {
            "success": True,
            "original_text": normalized_text,
            "refined_sentence": refined,
            "ai_generated": True,
            "model": used_model,
            "status": "ok",
            "message": "Sentence successfully refined using Groq AI.",
        }

    except ImportError:
        logger.warning("Groq SDK is not installed. Using fallback.")
        return {
            "success": True,
            "original_text": normalized_text,
            "refined_sentence": fallback,
            "ai_generated": False,
            "model": None,
            "status": "groq_not_installed",
            "message": "Groq library is not installed in the environment.",
        }
    except Exception as exc:
        logger.error("Groq API refinement failed (%s)", type(exc).__name__)
        # Always return a valid response so UI never breaks
        return {
            "success": True,
            "original_text": normalized_text,
            "refined_sentence": fallback,
            "ai_generated": False,
            "model": target_model,
            "status": "api_error",
            "message": f"Groq processing notice: {str(exc)}. Returned fallback sentence.",
        }


def get_groq_status() -> Dict[str, Union[bool, str, List[str]]]:
    """Return status of Groq configuration without revealing the secret key."""
    is_configured = bool(config.GROQ_API_KEY and len(config.GROQ_API_KEY) > 8)
    return {
        "configured": is_configured,
        "model": config.GROQ_MODEL,
        "timeout": config.GROQ_TIMEOUT,
        "supported_models": [
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "mixtral-8x7b-32768",
            "gemma2-9b-it",
        ],
    }
