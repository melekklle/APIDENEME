const express = require('express');
const upload = require('../config/multer');
const router = express.Router();
const Category = require('../models/Category');
const queryBuilder = require('../utils/queryBuilder');


router.get('/' , async(req,res) => {
try {
    const result = await queryBuilder(Category,req, {
        defaultLimit: 5,
        maxLimit:50,
        defultSort: 'createAt',
        allowedSortFields: ['name','status','createdAt','updateAt'],
        allowedFilterFields: ['name','description','status'],
        searchFields: ['name','description'],
        dateField:'createAt'
    });
    const dataWithImageUrls = result.data.map(category => ({
        ...category.toObject(),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${category.image}`
    }));
    const response = {
        ...result,
        data: dataWithImageUrls,
        success:true
    };
    res.json(response);

} catch (error) {
    res.status(500).json({
        success:false,
        message: error.message
    });
}
});
router.get('/:id', async (req,res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success:true,
                message:'Kategori Bulunamadı'
            });
        }
        res.json({
            success: true,
            data:{
                ...category.toObject(),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${plant.image}`
        }
    });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });        
    }
});

router.post('/', upload.single('image'), async (req, res) => {
try {
if (!req.file) {
    return res.status(400).json({
        success:false,
        message:'Kategori resmi yüklemesi zorunludur'
    });
}
const categoryData = {
    name: req.body.name,
    description:req.body.description,
    status: req.body.status || 'active',
    image:req.file.filename
};
const category = new Category(categoryData);
await category.save();
res.status(201).json({
    success:true,
    message:'Kategori Başarıyla Oluşturuldu',
    data: {
        ...category.toObject(),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${plant.image}`
    }
});
}catch (error) {
    if (req.file) {
        const fs = require('fs');
        const filePath = req.file.path;
        fs.unlink(filePath, (err) => {
            if (err) console.error('Dosya Silme Hatası', err);
        });
    }
    res.status(400).json({
        success:false,
        message:error.message
    });
}
});

router.put('/:id', upload.single('image'), async (req,res) => {
    try {
        const existingCategory = await Category.findById(req.params.id);
        if(!existingCategory) {
            return res.status(404).json({
                success:false,
                message:'Kategori bulunamadı'
            });
        }
        const updateData = {
            name:req.body.name || existingCategory.name,
            description:req.body.description || existingCategory.description,
            status:req.body.status || existingCategory.status
        };
        if (req.file) {
            const fs = require('fs');
            const path = require('path');
            const oldImagePath = path.join('public/image', existingCategory.image);

            fs.unlink(oldImagePath,(err) => {
                if(err) console.error('Eski dosya silme hatası:',err);
            });
            updateData.image = req.file.filename;
        }
        else {
            updateData.image = existingCategory.image;
        }
        const category = await Category.findByIdAndDelete(
            req.params.id,
            updateData,
            {
                new:true,
                runValidators: true
            }
        );
        res.json({
            success:true,
            message:'Kategori Güncellendi',
            data : {
                ...category.toObject(),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${plant.image}`
            }
        });
    } catch (error) {
        if (req.file) {
            const fs = require('fs');
            fs.unlink(req.file.path,(err) => {
                if(err) console.error('Dosya silme hatası:',err);
            });
        }
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
});

router.delete('/:id',async(req,res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success:false,
                message:'Kategori Bulunamadı'
            });
        }
        await Category.findByIdAndDelete(req.params.id);
        const fs = require ('fs');
        const path = require('path');
        const imagePath = path.join('public/image', category.image);
        fs.unlink(imagePath,(err) => {
            if(err) {
                console.error('Resim dosyası silme hatası:' , err);
            } else {
                console.log(`Resim dosyası silindi: ${category.image}`);
            }
        });
        res.json({
            success:true,
            message:'bitki ve ilişkili resim dosyası silindi',
            deletedData:
        })
    } catch (error) {
        
    }
})




