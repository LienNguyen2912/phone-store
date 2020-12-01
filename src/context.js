import React, { Component } from 'react'
import {storeProducts, detailProduct} from './data'

const ProductContext = React.createContext();
//Provider
//Consumer
class ProductProvider extends Component {
    state = {
        products: [],
        detailProduct:detailProduct,
        cart:[],
        modalOpen:false,
        modalProduct:detailProduct,
        cartSubTotal:0,
        cartTax:0,
        cartTotal:0
    };
    componentDidMount(){
        this.setProducts();
    }
    setProducts = () => {
        let tempProducts = [];
        storeProducts.forEach((item) => {
            const singleItem = {...item};
            tempProducts =[...tempProducts, singleItem]
        })
        this.setState( () => {
            return ({products: tempProducts});
        })
    }
    getItem = (id) => {
        const product = this.state.products.find(product => {
            return (product.id === id);
        });
        return product;
    }
    handleDetail = (id) => {
        
        const product = this.getItem(id);
        this.setState(() => {
            return ({detailProduct: product});
        });
    }
    // add new phone type into card
    addToCart = (id) =>{
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count += 1;
        const price = product.price;
        product.total += price;
        this.setState(
            () => {
                return({
                    products: tempProducts,
                    cart:[...this.state.cart, product]
                });
            },
            () => {
                this.addTotals();
            }
        );
    }
    openModal =(id) => {
        const product = this.getItem(id);
        this.setState(
            {
                modalProduct: product,
                modalOpen:true});
    }
    closeModal = () => {
        this.setState(
            {
                modalOpen:false});
    }
    // increase number of existed phone type at cart
    increment = (id) => {
        // update products
        let tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        //product.inCart = true;
        product.count += 1;
        const price = product.price;
        product.total += price;
        // update cart
        let temCart = [...this.state.cart].map(item => {
            if (item.id === id) {
                return product;
            } return item;
        })
        this.setState(
            () => {
                return ({
                    products: [...tempProducts],
                    cart:[...temCart]});
            },
            () => {
                this.addTotals();
            }
        );
        
    }
    decrement = (id) => {
        //update products
        let tempProduct = [...this.state.products];
        const index = tempProduct.indexOf(this.getItem(id));
        let decreasedProduct = tempProduct[index];
        decreasedProduct.count -= 1;
        if (decreasedProduct.count === 0) {
            this.removeItem(id);
            return;
        }
        decreasedProduct.total -= decreasedProduct.price;
        
        //update cart
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => {
               if (item.id === id) {
                return decreasedProduct;
               } else {
                   return item;
               }
        });

        this.setState( 
            () => {
                return {
                    cart: [...tempCart],
                    products:[...tempProduct]
                }
            }, 
            () => {
                this.addTotals();
            }
        )
    }
    removeItem = (id) => {
        let tempProduct = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => {
            return (item.id !== id);
        });
        const index = tempProduct.indexOf(this.getItem(id));
        let removedProduct = tempProduct[index];
        removedProduct.count = 0;
        removedProduct.inCart = false;
        removedProduct.total = 0;
        this.setState( 
            () => {
                return {
                    cart: [...tempCart],
                    products:[...tempProduct]
                }
            }, 
            () => {
                this.addTotals();
            }
        )
    }
    clearCart = () => {
        // let tempProducts = [...this.state.products];
        // tempProducts.map(product => {
        //     product.inCart = false;
        //     product.count = 0;
        //     product.total = 0;
        //     return product;
        // });
        // this.setState({
        //     products: tempProducts,
        //     cart:[],
        //     cartSubTotal:0,
        //     cartTax:0,
        //     cartTotal:0
        // });
        this.setState(
            () =>{
                return {cart:[]};
            },
            () =>{
                this.setProducts(); // reset product as when load from resource data.js
                this.addTotals();
            }
        );
    }
    
    addTotals = () => {
        let subTotal = 0;
        this.state.cart.map(item => {
            subTotal += item.total;
            return item;
        });
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = tax + subTotal;
        this.setState({
            cartSubTotal:subTotal,
            cartTax:tax,
            cartTotal:total
        });
    }
    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail:this.handleDetail,
                addToCart:this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                removeItem: this.removeItem,
                clearCart: this.clearCart
            }}>
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}
const ProductConsumer = ProductContext.Consumer;
export {ProductProvider, ProductConsumer};