module.exports = {
graf:{
    "flow": [
        {"step": {"process": "pr1"}},
        {"step": {"process": "pr2"}},
        {"paralel": [
                {"flow": [
                        {"step": {"process": "pr3"}},
                        {"step": {"process": "pr4"}}
                    ]
                },
                {"flow": [
                        {"step": {"process": "pr5"}}
                    ]
                },
                 {"flow": [
                        {"step": {"process": "pr3"}},
                        {"step": {"process": "pr4"}}
                    ]
                },
            ]
        },
        {"step": {"process": "pr6"}}
    ]
},
graf1:{
    "flow": [
        {"step": {"process": "pr1"}}
    ]
},

graf2:{
    "flow": [
        {"step": {"process": "pr1"}},
        {"step": {"process": "pr2"}}
    ]
}
}

