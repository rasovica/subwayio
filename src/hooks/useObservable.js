import {useEffect, useState} from "react";


export const useObservable = observable => {
    const [state, setState] = useState();

    useEffect(() => {
        const sub = observable.subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);

    return state;
};
