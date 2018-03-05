import React from 'react';
import PropTypes from 'prop-types';

import Product from '../Product';

import productProp from '../../lib/CustomPropTypes/product';

const styles = require('./styles.module.css');

class Navigation extends React.Component {
	static propTypes = {
		logoUrl: PropTypes.string,
		products: PropTypes.arrayOf(productProp).isRequired,
		setActiveProduct: PropTypes.func,
	}

	static defaultProps = {
		logoUrl: 'http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c39a.png',
		setActiveProduct: Function.prototype,
	}

	render() {

		const { products, logoUrl, setActiveProduct } = this.props;

		return (
			<section className={styles.container}>
				<img className={styles.logo} alt="logo for brand" src={logoUrl} />

				<div className={styles.navItems}>
					{products.map(product => <article onClick={() => setActiveProduct(product)} className={styles.navItem} key={product.id}><Product product={product}/></article>)}
				</div>
			</section>
		)
	}
}

export default Navigation;