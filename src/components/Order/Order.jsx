import { PureComponent } from 'react';
import { connect } from 'react-redux';
import './Order.css';

import { editOrder, removeOrder } from '../../model/model';

import { 
    editOrderNameAction,
    editOrderAuthorAction,
    removeOrderAction
} from '../../store/actions';


class Order extends PureComponent {

    onDragStart = (ev) => {
        const order = this.props.dates[this.props.orderArrId].orders[this.props.orderId];
        const movingOrderData = {
            orderId: this.props.orderId,
            orderArrId: this.props.orderArrId,
            orderName: order.name,
            orderAuthor: order.author
        };
        //console.log('dragstart:', this.props.orderId, 'start array', this.props.orderArrId);
        ev.dataTransfer.setData("order", JSON.stringify(movingOrderData));
    }

    onRemove = async () => {
        const ok = window.confirm('Удалить заказ?');
        if (!ok) {
            return;
        }

        const removeData = {
            orderId: this.props.orderId,
            orderArrId: this.props.orderArrId
        };
        await removeOrder(removeData);
        this.props.removeOrderDispatch(removeData);
    }

    onAuthorEdit = async () => {
        let newAuthor = prompt('Введите нового заказчика');
        if (!newAuthor || !newAuthor.trim()) {
            alert('Невалидный заказчик');
            return;
        }

        newAuthor = newAuthor.trim();

        const order = this.props.dates[this.props.orderArrId].orders[this.props.orderId];
        const orderEditData = {
            orderId: this.props.orderId,
            orderArrId: this.props.orderArrId,
            newAuthor: newAuthor
        };
        await editOrder({
            ...orderEditData,
            newName: order.name
        });
        this.props.editOrderAuthorDispatch(orderEditData);
    }

    onNameEdit = async () => {
        let newName = prompt('Введите новоe описание заказа');
        if (!newName || !newName.trim()) {
            alert('Невалидное описание');
            return;
        }
        
        newName = newName.trim();

        const order = this.props.dates[this.props.orderArrId].orders[this.props.orderId];
        const orderEditData = {
            orderId: this.props.orderId,
            orderArrId: this.props.orderArrId,
            newName: newName,
        };
        await editOrder({
            ...orderEditData,
            newAuthor: order.author
        });
        this.props.editOrderNameDispatch(orderEditData);
    }

    render() {
        const { orderId, orderArrId } = this.props;
        const order = this.props.dates[orderArrId].orders[orderId];

        return (
            <div className="orderarr-order" onDragStart = {(e) => this.onDragStart(e)} draggable>
                <div className="orderarr-order-description">
                <div className="orderarr-order-name">
                    { order.name }
                </div>
                <div className="orderarr-order-author">
                    { order.author }
                </div>
                </div>
                
                <div className="orderarr-order-controls">
                <div className="orderarr-order-controls-row">
                    <div className="orderarr-order-controls-icon delete-icon" onClick={this.onRemove}></div>
                </div>
                <div className="orderarr-order-controls-row">
                    <div className="orderarr-order-controls-icon editcust-icon" onClick={this.onAuthorEdit}></div>
                    <div className="orderarr-order-controls-icon editdesc-icon" onClick={this.onNameEdit}></div>
                </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ dates }) => ({ dates });

const mapDispatchToProps = dispatch => ({
    editOrderNameDispatch: ({ orderId, orderArrId, newName }) => dispatch(editOrderNameAction({ orderId, orderArrId, newName })),
    editOrderAuthorDispatch: ({ orderId, orderArrId, newAuthor }) => dispatch(editOrderAuthorAction({ orderId, orderArrId, newAuthor })),
    removeOrderDispatch: ({ orderId, orderArrId }) => dispatch(removeOrderAction({ orderId, orderArrId }))
});
  
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Order);
