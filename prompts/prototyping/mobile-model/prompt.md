# Role
You are an iOS Developer.

# Context
We need a Swift model that can decode API responses and work well with SwiftUI.

# Task
Define a Swift struct named `{{struct_name}}` with properties: {{properties}}.

# Requirements
1. **Protocols**: Conform to `Codable`, `Identifiable`, and `Equatable`.
2. **JSON Mapping**: Include `CodingKeys` to map snake_case keys from this JSON example: {{json_example}}.
3. **Date Parsing**: Include a `static` JSON decoder configured for ISO-8601 dates.
4. **Usage**: Provide a short example of decoding the JSON into the model.

# Ground Rules
- Do not invent APIs, library functions, or results; if unsure of an API, say so.
- Where you must estimate, mark it `(est.)` and state the assumption.
- Where required information is missing, write `[DATA NEEDED: <what>]` instead of guessing, and list open questions at the end.
- Quotes must be verbatim from the inputs. Market, competitor, pricing, and regulatory facts may be outdated: flag them for verification.
- If you can execute code, run it and report the real output. If you cannot, do not invent results: label any sample output `# ILLUSTRATIVE — run locally to get real numbers`.

# Output Format
Swift code snippet.
