module.exports = {
  tokenDecrypt: async function(ctx) {
    // get token froml the POST request
    const {token} = ctx.request.body;

    // check toek requirement
    if (!token) {
      return ctx.unauthorized('`token` param is missing')
    }

    try {
      // decrypt the jwt
      const tokenData = await strapi.plugins[
        'users-permissions'
      ].services.jwt.verify(token);

     return tokenData;
    } catch (err) {
      return ctx.unauthorized(err.toString());
    }
  }
};
