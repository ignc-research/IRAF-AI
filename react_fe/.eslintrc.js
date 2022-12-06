module.exports = {    
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "quotes": [
            "warn",
            "double"
        ],
        "react/prop-types": "off",
        "no-unused-vars": [
            "warn",
            { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
        ],
        
    },
    "overrides": [
        {
            "files": ["*.tsx", "*.ts"],
            "rules": {
                "no-undef": "off"
            }
        }
    ]
}
