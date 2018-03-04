import React from 'react';
import PropTypes from 'prop-types';

import Product from '../';

import productProp from '../../lib/CustomPropTypes/product';

const styles = require('./styles.css');

class Navigation extends React.Component {
	static propTypes = {
		logoUrl: PropTypes.string,
		products: PropTypes.arrayOf(productProp),
	}

	render() {

		const { products, logoUrl } = this.props;

		return (
			<section className={styles.container}>
				<img alt="logo for brand" src={logoUrl} />

				<div className={styles.navItems}>
					{
						products.map(product => )
					}
				</div>
			</section>
		)
	}
}

export default Navigation;