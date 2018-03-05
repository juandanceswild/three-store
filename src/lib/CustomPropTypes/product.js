import PropTypes from 'prop-types';

export default PropTypes.shape({
  image: PropTypes.string.isRequired,
  model: PropTypes.oneOfType([
  	PropTypes.string,
  	PropTypes.object]).isRequired,
  description: PropTypes.String,
})