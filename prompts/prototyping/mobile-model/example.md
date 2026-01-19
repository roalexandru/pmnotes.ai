import Foundation

struct UserProfile: Codable, Identifiable, Equatable {
    let id: String
    let name: String
    let email: String
    let signupDate: Date
    let avatarUrl: URL?

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case email
        case signupDate = "signup_date"
        case avatarUrl = "avatar_url"
    }

    static var decoder: JSONDecoder {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }
}

// Example Usage
let json = """
{ "id": "u_123", "name": "Alex", "email": "alex@example.com", "signup_date": "2024-01-15T10:00:00Z", "avatar_url": null }
"""

if let data = json.data(using: .utf8) {
    do {
        let profile = try UserProfile.decoder.decode(UserProfile.self, from: data)
        print("Loaded user: \(profile.name)")
    } catch {
        print("Failed to decode: \(error)")
    }
}
