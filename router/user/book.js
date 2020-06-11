const express = require('express');
const router = express.Router();
const cors = require('cors');

const multer = require('multer');
const  filter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
} 
const storage = multer.diskStorage({
    filename: function (req, file, cb) {    
        cb(null, new Date().toDateString() + file.originalname);
    },
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    }
})
const upload = multer({ 
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 8},
    fileFilter: filter
});

const Book = require('../../models/book');

// Lấy info tất cả các tựa sách
router.get('/', cors(), (req, res, next) => {
    Book.find({})
        .then((books) => {
            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Lấy info tựa sách bằng ID    
router.get('/title/:id', cors(), (req, res, next) => {
    const bookID = req.params.id;

    Book.findById(bookID)
        .populate({
            path: 'categories',
            select: 'name'
        })
        .then((book) => {
            if (!book) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấ tựa sách yêu cầu"
                });
            }

            return res.status(200).json({
                success: true,
                book: book
            });
        }).catch(next);
});

// Lây tựa sách theo tên
router.get('/title/:name', cors(), (req, res, next) => {
    const name = req.params.name;

    Book.find({name: name})
        .populate({
            path: 'categories',
            select: 'name'
        })
        .then((book) => {
            if (!book) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấ tựa sách yêu cầu"
                });
            }

            return res.status(200).json({
                success: true,
                book: book
            });
        }).catch(next);
});

// Nhập sách mới
router.post('/', cors(), (req, res, next) => {
    const book = new Book({
        name: req.body.name,
        image: req.body.bookImage,
        author: req.body.author,
        price: req.body.price,
        categories: req.body.categories,
        inStore: req.body.inStore
    });

    book.save().then((book) => {
        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Can't save"
            })
        }

        return res.status(200).json({
            success: true,
            book: book
        })
    }).catch(next);
});

// Nhập thêm sách cho 1 tựa sách
router.put('/quant', cors(), (req, res, next) => {
    const bookID = req.body.bookID;
    const quant = req.body.quant;

    if (quant < 1) {
        return res.status(400).json({
            success: false,
            message: "Không thể nhập giá trị âm"
        });
    }

    Book.findByIdAndUpdate(bookID, {$inc: {inStore: quant}}, {new: true})
        .then((book) => {
            if (!book) {
                return res.status(400).json({
                    success: false,
                    message: "Không tìm thấy tựa sách theo yêu cầu"
                });
            }

            return res.status(200).json({
                success: true,
                book: book
            });
        }).catch(next);
});

// Tìm tất cả các sách thuộc thể loại
router.get('/category/:cat', cors(), (req, res, next) => {
    const category = req.params.cat;

    Book.find({categories: {$all: category}})
        .populate({
            path: 'categories',
            select: 'name'
        })
        .then((books) => {
            return res.status(200).json({
                success: true,
                books: books
            });
        }).catch(next);
});

// Kiểm tra kho xem sách còn hàng hay không
stockCheck = (req, res, next) => {
    const bookID = req.body.bookID;
    const quant = req.body.quant;

    Book.findById(bookID, 'inStore')
        .then((book) => {
            if (!book) {
                res.status(400).json({
                    success: false,
                    message: "không tìm thấy tụa sách theo yêu cầu"
                });

                next();
            }

            if (book.inStore >= quant) {
                req.stocked = true;
            } else {
                req.stocked = false;
            }
        });

    next();
}

// Thêm category cho sách
router.put('/category/add', cors(), (req, res, next) => {
    const bookID = req.body.bookID;
    const cats = req.body.cats;

    Book.findByIdAndUpdate(bookID,{
        $push: {categories: { $each: cats }}
    }, {new: true}).then((book) => {
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sách"
            });
        }

        return res.status(200).json({
            success: true,
            book: book
        });
    }).catch(next);
});

module.exports = router;