import Foundation

struct UserProfile {
    let name: String
    let email: String
    let signupDate: Date

    // Custom initializer (optional if using default memberwise init, but good for clarity)
    init(name: String, email: String, signupDate: Date = Date()) {
        self.name = name
        self.email = email
        self.signupDate = signupDate
    }
}

// Example Usage
let newUser = UserProfile(
    name: "Alex Roman",
    email: "alex@example.com"
)

print("Created user: \(newUser.name) joined on \(newUser.signupDate)")
