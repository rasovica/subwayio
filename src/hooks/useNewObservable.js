import * as Rx from "rxjs";
import {useEffect, useState} from "react";


export const useNewObservable = () => {
    const [state, setState] = useState();
    const newObservable = Rx.Subject();

    useEffect(() => {
        const sub = newObservable.subscribe(setState);
        return () => sub.unsubscribe();
    }, [newObservable]);

    return [state, newObservable];
};
