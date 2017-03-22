export const formula = (_formula, _context) => {
    const _out = {};
    try {
        let _initVars = '';
        for (let _key in _context) {
            if (_context.hasOwnProperty(_key)) {
                _initVars += `var ${_key}=_context['${_key}'];`;
            }
        }
        _out.eval = _initVars + _formula;
        // eslint-disable-next-line
        _out.value = eval(_out.eval);
        _out.isValid = isFinite(_out.value);
    } catch (error) {
        _out.error = error.message;
    }
    return _out;
};
