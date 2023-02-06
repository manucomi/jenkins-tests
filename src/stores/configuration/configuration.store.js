import create from 'zustand';

// Config can be extended by adding fields to this object
const initialConfig = {
    apiOrigin: '',
};

const useConfigStore = create((set) => ({
    config: initialConfig,
    setConfig: (configKey, newValue) => {
        set((state) => ({
            config: { ...state.config, [configKey]: newValue },
        }));
    },
}));

useConfigStore.initialConfig = initialConfig;

export default useConfigStore;
