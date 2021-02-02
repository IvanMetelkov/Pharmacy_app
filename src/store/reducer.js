import {
    ADD_DATE,
    ADD_ORDER,
    EDIT_ORDER_NAME,
    EDIT_ORDER_AUTHOR,
    REMOVE_ORDER,
    DOWNLOAD_ORDERS_DATA
} from './actions';

const initialState = {
    dates: []
};

export default function reducer(state=initialState, {type, payload}) {

    switch(type) {
    case ADD_DATE:
        return {
            ...state,
            dates: [
                ...state.dates, payload
            ]/*.sort(((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))*/
        };
    case ADD_ORDER:
        return {
            ...state,
            dates: state.dates.map((orderArr, index) => (
                index === payload.orderArrId ? {
                    ...orderArr,
                    orders: [...orderArr.orders, payload.order]
                }
                : orderArr
            ))
        };
    case EDIT_ORDER_NAME:
        return {
            ...state,
            dates: state.dates.map((orderArr, index) => (
                index === payload.orderArrId ? {
                    ...orderArr,
                    orders: orderArr.orders.map((order, indexOrder) => (
                        indexOrder === payload.orderId ? {
                            ...order,
                            name: payload.newName
                        }
                        : order
                    ))
                }
                : orderArr
            ))
        };
    case EDIT_ORDER_AUTHOR:
        return {
            ...state,
            dates: state.dates.map((orderArr, index) => (
                index === payload.orderArrId ? {
                    ...orderArr,
                    orders: orderArr.orders.map((order, indexOrder) => (
                        indexOrder === payload.orderId ? {
                            ...order,
                            author: payload.newAuthor
                        }
                        : order
                    ))
                }
                : orderArr
            ))
        };
    case REMOVE_ORDER:
        return {
            ...state,
            dates: state.dates.map((orderArr, index) => (
                index === payload.orderArrId ? {
                    ...orderArr,
                    orders: orderArr.orders.filter((order, orderIndex) => (orderIndex !== payload.orderId))
                }
                : orderArr
            ))
        };
    case DOWNLOAD_ORDERS_DATA:
        return {
            ...state,
            dates: payload/*.sort(((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))*/
        };
    default:
        return state;
    }
};
