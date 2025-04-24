export class Subscription<T> {
    private _action: (newValue: T) => void;
    private _parentSubject: BehaviourSubject<T>;
    
    constructor(action: (newValue: T) => void, subject: BehaviourSubject<T>) {
        this._action = action;
        this._parentSubject = subject;
    }

    get action() {
        return this._action;
    }

    unsubscribe() {
        this._parentSubject.unsubscribe(this);
    }
}

export class BehaviourSubject<T> {
    private _value: T;
    private _subs: Subscription<T>[] = [];

    constructor(initialValue: T) {
        this._value = initialValue;
    }

    get value(): T {
        return this._value;
    }

    subscribe(action: (newValue: T) => void): Subscription<T> {
        const sub = new Subscription<T>(action, this);
        this._subs.push(sub);
        return sub;
    }

    emit(newValue: T): void {
        this._value = newValue;
        this._subs.forEach(s => {
            s.action(this._value);
        });
    }

    unsubscribe(s: Subscription<T>) {
        const i = this._subs.indexOf(s);
        this._subs.splice(i, 1);
    }
}
