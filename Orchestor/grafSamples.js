var graf1={"flow": [{"step": {"process": "pr1"}}]};

var graf2={
    "flow": [
        {"step": {"process": "pr1"}},
        {"step": {"process": "pr2"}}
    ]
};

var graf3={
    "flow": [
        {"step": {"process": "pr1"}},
        {"step": {"process": "pr2"}},
        {"paralel": [
                {"flow": [
                        {"step": {"process": "pr3"}}
                    ]
                },
                {"flow": [
                        {"step": {"process": "pr4"}}
                    ]
                }
            ]
        },
        {"step": {"process": "pr5"}}
    ]
};

exports.graf1=graf1;
exports.graf2=graf2;
exports.graf3=graf3;
