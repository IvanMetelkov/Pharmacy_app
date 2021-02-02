import { PureComponent } from 'react';
import { connect } from 'react-redux';
import './DateOrder.css';

import { addOrder } from '../../model/model';
import { removeOrder } from '../../model/model';

import Order from '../Order/Order';
import { addOrderAction, removeOrderAction } from '../../store/actions';


class DateOrder extends PureComponent {

    onDragOver = (ev) => {
       // console.log('123', this.props.orderArrId);
        ev.preventDefault();
    }

    onDrop = async (ev) => {
        let data = ev.dataTransfer.getData('order');
        var movingOrder = JSON.parse(data);
        if (this.props.orderArrId !== movingOrder.orderArrId){
       
            const movingOrderData = {
                order: {
                    name: movingOrder.orderName,
                    author: movingOrder.orderAuthor
                },
                orderArrId: this.props.orderArrId
            };

            await addOrder(movingOrderData);
            this.props.addOrderDispatch(movingOrderData);
            await removeOrder(movingOrder);
            this.props.removeOrderDispatch(movingOrder);
        }
    }

    onOrderAdd = async () => {
        let orderName = prompt('Введите описание заказа', '');
        if (!orderName || !orderName.trim()) {
            alert('Невалидное описание заказа!');
            return;
        }
        orderName = orderName.trim();

        let orderAuthor = prompt('Введите заказчика', '').trim();
        if (!orderAuthor || !orderAuthor.trim()) {
            alert('Невалидный заказчик!');
            return;
        }

        orderAuthor = orderAuthor.trim();
        const newOrderData = {
            order: {
                name: orderName,
                author: orderAuthor
            },
            orderArrId: this.props.orderArrId
        };

        await addOrder(newOrderData);
        this.props.addOrderDispatch(newOrderData);
    }

    render() {
        const orderArrId = this.props.orderArrId;
        const orderArr = this.props.dates[orderArrId];

        return (
        <div className="orderarr"onDragOver={(ev)=>this.onDragOver(ev)}
        onDrop={(e)=>{this.onDrop(e)}}
        > 
            <header className="orderarr-name">
                { orderArr.name }
            </header>
            <div className="orderarr-orders">
                {orderArr.orders.map((order, index) => (
                    <Order key={`order-${index}`} orderId={index} orderArrId={orderArrId} />
                ))}
            </div>
            <footer className="orderarr-add-task" onClick={this.onOrderAdd}>
                Добавить заказ
            </footer>
        </div>
        );
    }
}

const mapStateToProps = ({ dates }) => ({ dates });

const mapDispatchToProps = dispatch => ({
    addOrderDispatch: ({ order, orderArrId }) => dispatch(addOrderAction({ order, orderArrId })),
    removeOrderDispatch: ({ orderId, orderArrId }) => dispatch(removeOrderAction({ orderId, orderArrId }))
});
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DateOrder);
