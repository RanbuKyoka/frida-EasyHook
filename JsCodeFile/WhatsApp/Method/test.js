function log(text) {
    var packet = {
        'tpye': 'class',
        'data': text
    };
    send("log:" + JSON.stringify(packet))
}

function getTid() {
    var Thread = Java.use("java.lang.Thread")
    return Thread.currentThread().getId();
}

function getTName() {
    var Thread = Java.use("java.lang.Thread")
    return Thread.currentThread().getName();
}

function enter(tid, tname, cls, method, args) {
    var packet = {
        'type': 'args',
        'data': [tid, tname, cls, method, JSON.stringify(args)]
    };
    send("log:" + JSON.stringify(packet))
}

function exit(tid, retval) {
    var packet = {
        'tpye': 'return',
        'data': [tid, retval]
    };
    send("log:" + JSON.stringify(packet))
}

function traceClass(clsname) {
    try {
        var target = Java.use(clsname);
        var methods = target.class.getDeclaredMethods();
        methods.forEach(function (method) {
            var methodName = method.getName();
            var overloads = target[methodName].overloads;
            overloads.forEach(function (overload) {
                var proto = "(";
                overload.argumentTypes.forEach(function (type) {
                    proto += type.className + ", ";
                });
                if (proto.length > 1) {
                    proto = proto.substr(0, proto.length - 2);
                }
                proto += ")";
                log("hooking: " + JSON.stringify(clsname) + "." + JSON.stringify(methodName) + JSON.stringify(proto));
                overload.implementation = function () {
                    var args = [];
                    var tid = getTid();
                    var tName = getTName();
                    for (var j = 0; j < arguments.length; j++) {
                        args[j] = arguments[j]
                    }
                    enter(JSON.stringify(tid), JSON.stringify(tName), JSON.stringify(clsname), JSON.stringify(methodName) + JSON.stringify(proto), JSON.stringify(args));
                    var retval = this[methodName].apply(this, arguments);
                    exit(JSON.stringify(tid), "" + JSON.stringify(retval));
                    return retval;
                }
            });
        });
    } catch (e) {
        log("'" + clsname + "' hook fail: " + e)
    }
}

function main() {
    Java.perform(function () {
        traceClass('packclass');
    });
}

setImmediate(main);