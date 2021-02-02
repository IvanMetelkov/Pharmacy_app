import { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import DateOrder from '../DateOrder/DateOrder';
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { getDates, addDate } from '../../model/model';

import { downloadOrdersDataAction, addDateAction } from '../../store/actions';
import './App.css';

class App extends PureComponent {

    state = {
        isInputActive: false,
        inputValue: ''
    };

    constructor (props) {
        super(props)
        this.state = {
          startDate: new Date()
        };
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        const dates = await getDates();
        this.props.downloadOrdersDataDispatch(dates);
    }

    inputDate = () => {
        this.setState({
            isInputActive: true
        });
    }
    
    onInputChange = (event) => {
        this.setState({
            inputValue: event.target.value
        });
    }

    async handleChange(date) {

        if (date !== null){
        var month = date.getUTCMonth() + 1;
        var fMonth = (month < 10) ? '0' + month : month;
        var day = date.getUTCDate();
        var fDay = (day < 10) ? '0' + day : day;
        var year = date.getUTCFullYear();
        const orderArrName =fDay + "/" + fMonth + "/" + year;

        this.setState({
            isInputState: false,
            inputValue: ''
        })
        const orderArr = { name: orderArrName, orders: []};
        await addDate(orderArr);
        this.props.addDateDispatch(orderArr);
        this.setState({
            isInputActive: false
        });
    }
    }

    render() {
        const { isInputActive } = this.state;

        return (
            <Fragment>
                <header id="main-header">
                    Страница заказов
                </header>
                <main id="main-container">
                    {this.props.dates.map((orderArr, index) => (
                        <DateOrder key={`orderarr-${index}`} orderArrId={index}/>
                    ))}
                    <div className="orderarr">
                    {isInputActive && <form id="add-orderarr-input">
                    <div className="form-group" align="center">
                    <DatePicker selected={ this.state.startDate }
                    minDate={this.state.startDate}
                    onChange={ this.handleChange }
                    name="startDate"
                    />
                    </div>
                     </form>}
                    {!isInputActive && <header className="orderarr-name" onClick={this.inputDate}>
                        Добавить день заказа
                    </header>}
                    </div>
                </main>
            </Fragment>
        );
    }
}

const mapStateToProps = ({ dates }) => ({ dates });

const mapDispatchToProps = dispatch => ({
    addDateDispatch: (orderArr) => dispatch(addDateAction(orderArr)),
    downloadOrdersDataDispatch: (dates) => dispatch(downloadOrdersDataAction(dates)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
