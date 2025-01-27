const mongoose = require('mongoose');
const validate = require('express-validator')

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        // required: true
    },
    projectType: {
        type: String,
        enum: [
            "Residential",
            "Commercial",
            "Office",
            "Retail",
            "Hospitality"
        ]
    },

    startDate: {
        type: String
    },
    endDate: {
        type: String
    },

    assigned: {
        type: String
    },
    fullAddress: { type: String },
    city: { type: String },
    pincode: { type: Number },

    // clientType: {
    //     type: String,
    //     enum: ['corporate', 'individual'],
    //     required: true
    // },
    // // Company name only required if clientType is corporate
    // companyName: {
    //     type: String,
    //     required: function () {
    //         return this.clientType === 'corporate';
    //     }
    // },
    clientName: { type: String },
    contactNumber: { type: String },
    emailAddress: { type: String },

    referral: {
        referredBy: String
    },
    architectName: { type: String },
    architectCompanyName: { type: String },
    architectPhone: { type: String },
    architectEmail: { type: String },
    // address: String


    projectStatus: {
        type: String,
        enum: [
            "Planned",
            "In Progress",
            "Completed",
            "On Hold",
            "Cancelled"
        ]
    },
    currentStage: {
        type: String,
        enum: [
            "Presentation",
            "Quotation",
            "Measurement",
            "Finalization",
            "Execution"
        ]
    },
    designPreferences: {
        style: {
            type: String,
            enum: [
                "Contemporary",
                "Minimalist",
                "Industrial",
                "Traditional"
            ]
        },
        theme: String
    },
    assignedDesigners: [{ type: String }],
    projectTerms: String,
    paymentTerms: String,
    aboutProject: {
        type: String
    }
});
// projectSchema.pre('save', function (next) {
//     if (this.client.clientType === 'individual' && this.client.companyName) {
//         this.client.companyName = undefined;
//     }
//     next();
// });


module.exports = mongoose.model('Project', projectSchema);
