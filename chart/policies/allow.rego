package com.huna2.agenticxp

default allow = false

# Public authorization rule
allow if {
    user_is_logged_in
}

user_is_logged_in if {
  token_is_present
  rawToken := extract_token(input.headers.authorization)
  decodedToken := decode_token_parts(rawToken)
  kid := decodedToken[0].kid

}

token_is_present if {
    input.headers.authorization
    startswith(input.headers.authorization, "Bearer ")
}

extract_token(header) = extracted if {
    extracted := substring(header, 7, -1)
}

decode_token_parts(token) = decodedToken if {
    decodedToken := io.jwt.decode(token)
}

get_jwks(kid) = jwks if {
    jwks := http.send({
        "url": sprintf("%s/keys?kid=%s", [data.idp.issuerInternalUrl, kid]),
        "cache": true,
        "method": "GET",
        "force_cache": true,
        "force_cache_duration_seconds": 3600
    }).raw_body
}