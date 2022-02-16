// path: ./src/api/post/controllers/post.js

// import { parseMultipartData, sanitizeEntity } from 'strapi-utils'


const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

   async find(ctx) {
    let entities;

    const query = {...ctx.query, user: ctx.state.user }

    if (ctx.query._q) {
      entities = await strapi.services.post.search(query);
    } else {
      entities = await strapi.services.post.find(query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.post }));
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const entity = await strapi.services.post.findOne({ user: ctx.state.user, id });
    return sanitizeEntity(entity, { model: strapi.models.post });
  },


  count(ctx) {
    const query = { ...ctx.query, user: ctx.state.user }
    if (ctx.query._q) {
      return strapi.services.post.countSearch(query);
    }
    return strapi.services.post.count(query);
  },


  async create(ctx) {
    const { id } = ctx.state.user;
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.post.create({
        ...data, user: id,
      }, { files });
    } else {
      entity = await strapi.services.post.create({
        ...ctx.request.body, // o correto seria pegar os atributos de forma específicas
        user: id,
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async update(ctx) {
    const { id } = ctx.params;
    const { title, content } = ctx.request.body;
    let entity;

    const post = await strapi.services.post.find({ user: ctx.state.user, id });
    if(!post || !post.length) {
        return ctx.unauthorized('You cannot update this post.')
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.post.update({ id,  user: ctx.state.user }, {
        ...data,
        title,
        content,
      }, {
        files,
      });
    } else {
      entity = await strapi.services.post.update({ id,  user: ctx.state.user }, {title, content });
    }
    return sanitizeEntity(entity, { model: strapi.models.post });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const post = await strapi.services.post.find({ user: ctx.state.user, id });
    if(!post || !post.length) {
      return ctx.unauthorized('You cannot delete this post.')
    }

    const entity = await strapi.services.post.delete({ id, user: ctx.state.user });
    return sanitizeEntity(entity, { model: strapi.models.post });
  },
};
