const props = {
    make: 'make',
    model: 'model',
    storage: 'storage',
    monthlyPremium: 'monthly_premium',
    yearlyPremium: 'yearly_premium',
    excess: 'excess'
}    

const PhoneValidator = (() => {
    const validator = {
        verifyMake: (_make) => {
            if (!_make) throw new Error(`make: ${_make}`);
        },
        verifyModel: (_model) => {
            if (!_model) throw new Error(`model: ${_model}`);
        },
        verifyStorage: (_storage) => {
            if (!_storage) throw new Error(`storage: ${_storage}`);
            if (Number.isNaN(Number(_storage))) throw new Error(`storage: ${_storage} not a number`);            
        },
        verifyMonthlyPremium: ((_monthlyPremium) => {
            if (!_monthlyPremium) throw new Error(`monthlyPremium: ${_monthlyPremium}`);
            if (Number.isNaN(Number(_monthlyPremium))) throw new Error(`monthlyPremium: ${_monthlyPremium} not a number`);
        }),
        verifyYearlyPremium: ((_monthlyPremium, _yearlyPremium) => {
            if (!_yearlyPremium) throw new Error(`yearlyPremium: ${_yearlyPremium}`);
            if (Number.isNaN(Number(_yearlyPremium))) throw new Error(`yearlyPremium: ${_yearlyPremium} not a number`);
            if (Number(_monthlyPremium) * 11 != Number(_yearlyPremium)) throw new Error(`yearlyPremium: ${_yearlyPremium} does not match with monthlyPremium: ${_monthlyPremium}`);
        }),
        verifyExcess: ((_excess) => {
            if (!_excess) throw new Error(`excess: ${_excess}`);
            if (Number.isNaN(Number(_excess))) throw new Error(`excess: ${_excess} not a number`);
            if (!Number.isInteger(Number(_excess))) throw new Error(`excess: ${_excess} not integer`);
        }),
    };
    return validator;
})();

const PhoneBuilder = (() => {
    let _make;
    let _model;
    let _storage;
    let _monthlyPremium;
    let _yearlyPremium;
    let _excess;
    const phone = {
        make: (make) => {
            _make = make;
            return phone;
        },
        model: (model) => {
            _model = model;
            return phone;
        },
        storage: (storage) => {
            _storage = storage;
            return phone;
        },
        monthlyPremium: (monthlyPremium) => {
            _monthlyPremium = monthlyPremium;
            return phone;
        },
        yearlyPremium: (yearlyPremium) => {
            _yearlyPremium = yearlyPremium;
            return phone;
        },
        excess: (excess) => {
            _excess = excess;
            return phone;
        },        
        build: () => {
            PhoneValidator.verifyMake(_make);
            PhoneValidator.verifyModel(_model);
            PhoneValidator.verifyStorage(_storage);
            PhoneValidator.verifyMonthlyPremium(_monthlyPremium);
            PhoneValidator.verifyYearlyPremium(_monthlyPremium, _yearlyPremium);
            PhoneValidator.verifyExcess(_excess);

            const _phoneInstance = {};
            _phoneInstance[props.make] = _make;
            _phoneInstance[props.model] = _model;
            _phoneInstance[props.storage] = _storage;
            _phoneInstance[props.monthlyPremium] = _monthlyPremium;
            _phoneInstance[props.yearlyPremium] = _yearlyPremium;
            _phoneInstance[props.excess] = _excess;
            return _phoneInstance;
        },
        filterProps: (src) => {
            const target = {};
            for (const prop in props) {
                if (src[props[prop]]) {
                    target[props[prop]] = src[props[prop]];
                }
            }

            PhoneValidator.verifyMake(target[props.make]);
            PhoneValidator.verifyModel(target[props.model]);
            PhoneValidator.verifyStorage(target[props.storage]);
            PhoneValidator.verifyMonthlyPremium(target[props.monthlyPremium]);
            PhoneValidator.verifyYearlyPremium(target[props.monthlyPremium], target[props.yearlyPremium]);
            PhoneValidator.verifyExcess(target[props.excess]);

            return target;
        }
    };
    return phone;
})();

module.exports = { PhoneBuilder }; 