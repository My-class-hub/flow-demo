import {createStorage} from "@/hook/local";

const storage = createStorage({prefixKey: "ACCESS_", storage: localStorage});

export const http = (url: string, method: string = 'GET', body: any = void 0) => {

    return fetch(url, {
        method: method,
        body: body ? JSON.stringify(body) : body,
        headers: storage.get("TOKEN") ? {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': (`Bearer ${storage.get("TOKEN")}`)
        } : {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    })
}

export const upload = (url: string, method: string = 'POST',data: Record<string, any>) => {
    const formData = new FormData()
    Object.keys(data).map(item => {
        formData.append(item,data[item])
    })
    return fetch(url,
        {
            method,
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Authorization': (`Bearer ${storage.get("TOKEN")}`)
            },
        })
}