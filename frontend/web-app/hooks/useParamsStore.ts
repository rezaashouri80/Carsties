import { create } from "zustand";

type State = {
    pageCount : number;
    pageNumber: number;
    pageSize: number;
    searchTerm : string;
    orderBy: string;
    filterBy : string;
}

type Actions = {
    setParams : (params:Partial<State>) => void;
    reset : () => void;
}

const initialState : State ={
    pageNumber:1,
    pageSize:12,
    searchTerm:'',
    pageCount:1,
    orderBy:"make",
    filterBy:"live"
}


export const useParamsStore = create<State & Actions>((set) => ({
      ...initialState,

    setParams: (newParams: Partial<State>) => {
        set((state) => {
            if (newParams.pageNumber !== undefined) {
                return { ...state, pageNumber: newParams.pageNumber };
            } else {
                console.log(1)
                return { ...state, ...newParams, pageNumber: 1 };
            }
        });
    },
    reset: () => set(initialState),
}));