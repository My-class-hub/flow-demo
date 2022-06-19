import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Menu {
    menuItem?: Item[]
}

interface Item {
    label: string,
    key: string
}

const initialState: Menu = {
    menuItem: []
}

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        updateMenu: (state, action: PayloadAction<Item[]>) => {
            state.menuItem = action.payload
        }
    }
})

export const {updateMenu} = menuSlice.actions

export default menuSlice.reducer