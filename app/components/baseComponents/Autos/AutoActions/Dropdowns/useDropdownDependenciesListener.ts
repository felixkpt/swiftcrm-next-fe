import { useEffect } from 'react';
import { subscribe } from '../../../utils/pubSub';

const useDropdownDependenciesListeners = (modelID:string, dropdownSource:string, dropdownDependsOn:string[] | null, dependenciesHandler:(newValue: Record<string, string>) => void) => {
    useEffect(() => {
        if (dropdownDependsOn) {
            const listeners = dropdownDependsOn.map(dep => {
                const listenerId = `${modelID}_update_${dep}`;
                const unsubscribe = subscribe(listenerId, dependenciesHandler);
                return unsubscribe;
            });

            return () => {
                listeners.forEach(unsub => unsub());
            };
        }
    }, [modelID, dropdownSource, dropdownDependsOn]);
};

export default useDropdownDependenciesListeners;
