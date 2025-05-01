package com.huna2.agenticxp

default allow = false

# Public authorization rule
allow if {
    has_valid_token
}

# Core token verification logic
has_valid_token if {
    token := get_token_from_header(input.headers.authorization)
    payload := io.jwt.decode(token)

    jwks := get_jwks()
    verify_signature(token, jwks.keys)
    not expired(payload)
}

# Get JWKS using native HTTP caching
get_jwks() = jwks if {
    url := sprintf("http://%s/keys.json", [opa.runtime().env.OIDC_ISSUER_INTERNAL])

    # Use http.send with the cache feature enabled
    response := http.send({
        "method": "GET",
        "url": url,
        "headers": {"Cache-Control": "max-age=3600"}  # 1 hour cache
    })

    # Ensure the response contains valid body (JWKS keys)
    jwks := response.body
}

# JWT expiration check
expired(payload) if {
    payload.exp <= time.now_ns() / 1000000000
}

# Extract token from Authorization header
get_token_from_header(authz_header) = token if {
    startswith(authz_header, "Bearer ")
    token := substring(authz_header, count("Bearer "), -1)
}

# Verify JWT signature using JWKS keys
verify_signature(token, keys) = valid if {
    some key in keys
    io.jwt.verify_rs256(token, key)
    valid := true
} else = false if {
    true
}
