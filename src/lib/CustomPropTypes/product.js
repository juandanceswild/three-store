import PropTypes from 'prop-types';

export default PropTypes.shape({
  image: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  description: PropTypes.String,
})