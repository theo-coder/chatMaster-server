module.exports.validateRegisterInput = (pseudo, password, confirmPassword) => {
    const errors = {}
    if (pseudo.trim() === '') {
        errors.pseudo = 'You must provide a pseudo'
    }
    if (password === '') {
        errors.password = 'You must provide a password'
    } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (pseudo, password) => {
    const errors = {}
    if (pseudo.trim() === '') {
        errors.pseudo = 'You must provide a pseudo'
    }
    if (password === '') {
        errors.password = 'You must provide a password'
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}