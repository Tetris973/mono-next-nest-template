/**
 * Here we define all the keys and values for the ConfigService Object used in the application
 */
export default () => ({
  // Use port 4000 for development as frontend uses 3000
  port: parseInt(process.env.PORT || '4000', 10),
});
