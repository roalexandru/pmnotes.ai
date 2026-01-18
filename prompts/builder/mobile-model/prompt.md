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

# Output Format
Swift code snippet.
