# OpenAI API Integration Pattern for convrSAYit (Rails Backend)

This document outlines a pattern for integrating OpenAI API functionalities into the convrSAYit Rails backend. This will primarily be used for features like explaining phrases, clarifying grammar, and generating alternative phrase versions.

## 1. Configuration

First, ensure your OpenAI API key is securely stored, for example, in Rails credentials or environment variables.

```ruby
# config/initializers/openai.rb (or similar)
require 'openai'

OpenAI.configure do |config|
  config.access_token = ENV.fetch("OPENAI_API_KEY")
  # Optionally, you can set organization, request_timeout, etc.
end

# Ensure OPENAI_API_KEY is set in your .env file or Rails credentials
# For example, in config/credentials.yml.enc:
# openai_api_key: your_actual_api_key_here
#
# And in config/application.rb or an initializer:
# ENV['OPENAI_API_KEY'] = Rails.application.credentials.openai_api_key
```

Install the `ruby-openai` gem:
```bash
# Gemfile
gem 'ruby-openai'

# Then run in terminal
# bundle install
```

## 2. Service Module/Class for OpenAI Interactions

It's good practice to encapsulate API interactions within a service object or module.

```ruby
# app/services/openai_service.rb

class OpenaiService
  attr_reader :client

  def initialize
    @client = OpenAI::Client.new
  end

  # --- Explain Phrase ---
  # Explains a given phrase in plain English and can provide casual alternatives.
  #
  # @param phrase [String] The Romanian phrase to explain.
  # @param target_language [String] The language to explain the phrase in (e.g., "English").
  # @param context [String] (Optional) Additional context about the phrase or situation.
  # @return [Hash] A hash containing the explanation and alternatives, or an error.
  #   Example success: { explanation: "...", alternatives: ["...", "..."] }
  #   Example error: { error: "Failed to get explanation from OpenAI." }
  def explain_phrase(phrase:, target_language: "English", context: nil)
    prompt = <<~PROMPT
      Explain the Romanian phrase "#{phrase}" in plain #{target_language}.
      #{context if context.present?}
      Also, provide up to 3 casual alternatives for this phrase if appropriate.
      Structure your response as a JSON object with two keys: "explanation" (string) and "alternatives" (array of strings).
    PROMPT

    begin
      response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo", # Or your preferred model
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 250
        }
      )
      # Assuming the response is JSON formatted as requested
      parsed_response = JSON.parse(response.dig("choices", 0, "message", "content"))
      {
        explanation: parsed_response["explanation"],
        alternatives: parsed_response["alternatives"]
      }
    rescue JSON::ParserError => e
      Rails.logger.error "OpenAI Service: Failed to parse JSON response - #{e.message}"
      { error: "OpenAI returned an invalid format." }
    rescue StandardError => e
      Rails.logger.error "OpenAI Service Error (explain_phrase): #{e.message}"
      { error: "Failed to get explanation from OpenAI." }
    end
  end

  # --- Generate Alternative Phrase Versions (e.g., funny, formal) ---
  # Generates alternative versions of a given phrase based on a specified style.
  #
  # @param phrase [String] The original phrase.
  # @param style [String] The desired style (e.g., "funny", "formal", "more casual", "for a child").
  # @param language [String] The language of the phrase (e.g., "Romanian").
  # @param count [Integer] Number of alternatives to generate.
  # @return [Hash] A hash containing the alternatives or an error.
  #   Example success: { alternatives: ["...", "..."] }
  #   Example error: { error: "Failed to generate alternatives from OpenAI." }
  def generate_alternatives(phrase:, style:, language: "Romanian", count: 3)
    prompt = <<~PROMPT
      Given the #{language} phrase: "#{phrase}"
      Generate #{count} alternative versions of this phrase in a "#{style}" style.
      Return the alternatives as a JSON object with a single key "alternatives" which is an array of strings.
    PROMPT

    begin
      response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 200
        }
      )
      parsed_response = JSON.parse(response.dig("choices", 0, "message", "content"))
      { alternatives: parsed_response["alternatives"] }
    rescue JSON::ParserError => e
      Rails.logger.error "OpenAI Service: Failed to parse JSON response for alternatives - #{e.message}"
      { error: "OpenAI returned an invalid format for alternatives." }
    rescue StandardError => e
      Rails.logger.error "OpenAI Service Error (generate_alternatives): #{e.message}"
      { error: "Failed to generate alternatives from OpenAI." }
    end
  end

  # --- Generic Grammar Clarification ---
  # Answers a specific grammar question related to a phrase or rule.
  #
  # @param question [String] The user's grammar question.
  # @param phrase_context [String] (Optional) The phrase the question is about.
  # @param language [String] The language in question (e.g., "Romanian").
  # @return [Hash] A hash containing the answer or an error.
  #   Example success: { answer: "..." }
  #   Example error: { error: "Failed to get grammar clarification from OpenAI." }
  def clarify_grammar(question:, phrase_context: nil, language: "Romanian")
    prompt = <<~PROMPT
      Regarding #{language} grammar:
      #{phrase_context ? 

Regarding #{language} grammar:
      #{phrase_context ? "The question is about the phrase: \"#{phrase_context}\"." : ""}
      Question: "#{question}"
      Provide a clear and concise answer in plain English.
      Return the answer as a JSON object with a single key "answer" which is a string.
    PROMPT

    begin
      response = client.chat(
        parameters: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 300 # Allow for more detailed explanations
        }
      )
      parsed_response = JSON.parse(response.dig("choices", 0, "message", "content"))
      { answer: parsed_response["answer"] }
    rescue JSON::ParserError => e
      Rails.logger.error "OpenAI Service: Failed to parse JSON response for grammar - #{e.message}"
      { error: "OpenAI returned an invalid format for grammar clarification." }
    rescue StandardError => e
      Rails.logger.error "OpenAI Service Error (clarify_grammar): #{e.message}"
      { error: "Failed to get grammar clarification from OpenAI." }
    end
  end

  # --- Help Build Personalized Practice Agendas (More Complex - Example Stub) ---
  # This would require more context about user progress, goals, etc.
  #
  # @param user_profile [Hash] User learning level, goals, etc.
  # @param recent_phrases [Array<Hash>] Recently practiced or struggled phrases.
  # @return [Hash] A hash containing a suggested practice agenda or an error.
  def suggest_practice_agenda(user_profile:, recent_phrases: [])
    # This is a simplified prompt. A real implementation would be more detailed.
    prompt = <<~PROMPT
      A Romanian language learner with the following profile: #{user_profile.to_json}
      has recently interacted with these phrases: #{recent_phrases.to_json}
      Suggest a personalized practice agenda for the next 3-5 sessions, focusing on areas for improvement and reinforcing learned concepts.
      Return the agenda as a JSON object with a key "agenda" containing an array of suggested activities or phrase categories.
    PROMPT

    begin
      response = client.chat(
        parameters: {
          model: "gpt-4", # Might need a more capable model for this
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 500
        }
      )
      parsed_response = JSON.parse(response.dig("choices", 0, "message", "content"))
      { agenda: parsed_response["agenda"] }
    rescue JSON::ParserError => e
      Rails.logger.error "OpenAI Service: Failed to parse JSON response for agenda - #{e.message}"
      { error: "OpenAI returned an invalid format for agenda." }
    rescue StandardError => e
      Rails.logger.error "OpenAI Service Error (suggest_practice_agenda): #{e.message}"
      { error: "Failed to suggest practice agenda from OpenAI." }
    end
  end
end

## 3. Controller Usage Example (Rails)

Here is how you might use this service in a Rails controller.

```ruby
# app/controllers/api/v1/phrases_controller.rb
module Api
  module V1
    class PhrasesController < ApplicationController
      before_action :set_openai_service

      # POST /api/v1/phrases/:id/explain
      def explain
        phrase = PhraseCard.find(params[:id]) # Assuming you have a PhraseCard model
        # User's target language could come from current_user.native_language or params
        result = @openai_service.explain_phrase(
          phrase: phrase.romanian_phrase,
          target_language: params.fetch(:target_language, "English"),
          context: params[:context]
        )

        if result[:error]
          render json: { error: result[:error] }, status: :unprocessable_entity
        else
          render json: result, status: :ok
        end
      end

      # POST /api/v1/phrases/:id/generate_alternatives
      def generate_alternatives
        phrase = PhraseCard.find(params[:id])
        result = @openai_service.generate_alternatives(
          phrase: phrase.romanian_phrase,
          style: params.require(:style), # e.g., "funny", "formal"
          language: phrase.language || "Romanian", # Assuming phrase model has language
          count: params.fetch(:count, 3).to_i
        )

        if result[:error]
          render json: { error: result[:error] }, status: :unprocessable_entity
        else
          render json: result, status: :ok
        end
      end

      # POST /api/v1/grammar/clarify
      def clarify_grammar
        result = @openai_service.clarify_grammar(
          question: params.require(:question),
          phrase_context: params[:phrase_context],
          language: params.fetch(:language, "Romanian")
        )

        if result[:error]
          render json: { error: result[:error] }, status: :unprocessable_entity
        else
          render json: result, status: :ok
        end
      end

      private

      def set_openai_service
        @openai_service = OpenaiService.new
      end
    end
  end
end
```

## 4. Request/Response Structure Summary

### Explain Phrase
*   **Request (to your API endpoint, e.g., `POST /api/v1/phrases/:id/explain`):**
    *   `id` (URL param): ID of the phrase to explain.
    *   `target_language` (optional, body/query param): Language for the explanation (defaults to English).
    *   `context` (optional, body/query param): Additional context.
*   **OpenAI Prompt (Simplified):** "Explain Romanian phrase `[PHRASE]` in `[TARGET_LANGUAGE]`. Provide alternatives. Respond in JSON: `{ "explanation": "...", "alternatives": [...] }`"
*   **Response (from your API endpoint):**
    *   Success (200 OK):
        ```json
        {
          "explanation": "The phrase 'Ce faci?' means 'How are you?' in English. It is an informal greeting.",
          "alternatives": [
            "Ce mai faci?",
            "Cum ești?",
            "Care-i treaba?"
          ]
        }
        ```
    *   Error (e.g., 422 Unprocessable Entity):
        ```json
        {
          "error": "Failed to get explanation from OpenAI."
        }
        ```

### Generate Alternative Versions
*   **Request (to your API endpoint, e.g., `POST /api/v1/phrases/:id/generate_alternatives`):**
    *   `id` (URL param): ID of the phrase.
    *   `style` (required, body/query param): Desired style (e.g., "funny", "formal").
    *   `language` (optional, body/query param): Language of the phrase (defaults to Romanian).
    *   `count` (optional, body/query param): Number of alternatives (defaults to 3).
*   **OpenAI Prompt (Simplified):** "Generate `[COUNT]` `[STYLE]` versions of `[LANGUAGE]` phrase `[PHRASE]`. Respond in JSON: `{ "alternatives": [...] }`"
*   **Response (from your API endpoint):**
    *   Success (200 OK):
        ```json
        {
          "alternatives": [
            "Oare ce mai meșterești?",
            "Ce se mai aude, boss?",
            "Faci ceva interesant pe-acolo?"
          ]
        }
        ```
    *   Error:
        ```json
        {
          "error": "Failed to generate alternatives from OpenAI."
        }
        ```

### Clarify Grammar
*   **Request (to your API endpoint, e.g., `POST /api/v1/grammar/clarify`):**
    *   `question` (required, body/query param): The grammar question.
    *   `phrase_context` (optional, body/query param): The phrase the question relates to.
    *   `language` (optional, body/query param): Language in question (defaults to Romanian).
*   **OpenAI Prompt (Simplified):** "Regarding `[LANGUAGE]` grammar (context: `[PHRASE_CONTEXT]`): `[QUESTION]`. Respond in JSON: `{ "answer": "..." }`"
*   **Response (from your API endpoint):**
    *   Success (200 OK):
        ```json
        {
          "answer": "In Romanian, adjectives generally agree in gender, number, and case with the noun they modify. For example..."
        }
        ```
    *   Error:
        ```json
        {
          "error": "Failed to get grammar clarification from OpenAI."
        }
        ```

## 5. Error Handling and Logging

The `OpenaiService` example includes basic error handling (catching `StandardError` and `JSON::ParserError`) and logging to `Rails.logger`. This should be expanded based on specific needs, potentially including custom error classes, more specific retries, or circuit breaker patterns for more robust API interaction.

## 6. Testing

When testing, you would typically mock the `OpenAI::Client` calls to avoid making actual API calls during your test suite. Use VCR or similar gems for recording and replaying API interactions if needed for integration tests.

This pattern provides a solid foundation for integrating OpenAI into the convrSAYit application. Remember to adapt prompts and parameters based on the specific capabilities and desired output from the chosen OpenAI models.
