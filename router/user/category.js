const express = require('express');
const router = express.Router();
const cors = require('cors');

const Category = require('../../models/category');

// Lấy tất cả các category
router.get('/', cors(), (req, res, next) => {
    Category.find({})
        .then(categories => {
            return res.status(200).json({
                success: true,
                categories: categories
            })
        }).catch(next);
});

// Thêm category
router.post('/', (req, res, next) => {
    const category = new Category({
        name: req.body.name
    });

    category.save().then(() => {
        return res.status(200).json({
            success: true,
            message: "Thêm thành công"
        })
    }).catch(next);
});

module.exports = router;