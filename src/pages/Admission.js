import React, { useState, useEffect } from 'react';
import '../../src/styles/admission.css'
import { submitForm } from '../api/admissionApi';
import { createOrder } from '../api/razorpay';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../../src/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


const initialValues = {
    sfirstname: "",
    smiddlename: "",
    slastname: "",
    email: "",
    contact: "",
    gender: "",
    course: "",
    address: "",
    dob: "",
    placeofbirth: "",
    religion: "",
    aadhar: "",
    father: { ffirstname: "", fmiddlename: "", flastname: "" },
    mother: { mfirstname: "", mmiddlename: "", mlastname: "" },
    examinationDetails: {
        ssc: {
            board: "",
            certNo: "",
            seatNo: "",
            marks: "",
            outOf: "",
            passingYear: "",
            qualified: "",
            schoolName: ""
        },
        hsc: {
            hboard: "",
            hcertNo: "",
            hseatNo: "",
            hmarks: "",
            houtOf: "",
            hpassingYear: "",
            hqualified: "",
            hschoolName: ""
        },
    },
};

const courses = ["BMS", "BSc IT", "B.A", "BSc"];
const years = Array.from({ length: 26 }, (_, i) => 2000 + i);

const AdmissionForm = () => {
    const [formKey, setFormKey] = useState(Date.now());
    const [values, setValues] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate(); // React Router navigation
    const location = useLocation();

    // Load saved data once when the component mounts
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) {
            setValues((prev) => ({
                ...prev,
                ...savedData, // Merge saved data with existing state
            }));
        }
    }, []); // Empty dependency array ensures it runs only once

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => console.log("Razorpay SDK Loaded");
        document.body.appendChild(script);
    }, []);

    const handleChanges = (e) => {
        const { name, value, type, files } = e.target;

        setValues((prev) => {
            if (name.includes(".")) {
                const [section, key] = name.split(".");
                return {
                    ...prev,
                    [section]: { ...prev[section], [key]: value },
                };
            }

            return {
                ...prev,
                [name]: type === "file" ? files[0] : value,
            };
        });
    };

    const renderTextInput = (label, name, placeholder) => (
        <div>
            {/* <label htmlFor={name}>{label}*</label> */}
            <input
                className="adm-input"
                type={name === 'email' ? 'email' : "text"}
                placeholder={placeholder}
                name={name}
                value={values[name] || ""}
                onChange={handleChanges}
                autoComplete="off" // Disables autofill
                minLength={name === 'contact' ? 10 : name === 'aadhar' ? 12 : 1}
                maxLength={name === 'contact' ? 10 : name === 'aadhar' ? 12 : 40}
                required
            />
        </div>
    );

    // const downloadPdf = async (receiptId, trnId) => {
    //     const userData = {
    //         name: values.sfirstname,
    //         email: values.email,
    //         amountPaid: "₹100",
    //         transactionId: trnId,
    //         receiptId: receiptId,
    //         collegeName: 'Shri P.L.Shroff College'
    //     };

    //     // Generate PDF
    //     const doc = new jsPDF();
    //     // Add College Name at the Top
    //     doc.setFont("helvetica", "bold");
    //     doc.setFontSize(18);
    //     doc.text(userData.collegeName, 20, 20);

    //     // Add Title
    //     doc.setFontSize(14);
    //     doc.text("Admission Payment Receipt", 20, 40);

    //     // Add user details
    //     doc.setFont("helvetica", "normal");
    //     doc.setFontSize(12);
    //     let y = 60; // Start at y=60 to avoid overlapping with title
    //     const lineSpacing = 10; // Space between each line

    //     doc.text(`Student Id: ${userData.receiptId}`, 20, y);
    //     y += lineSpacing;
    //     doc.text(`Name: ${userData.name}`, 20, y);
    //     y += lineSpacing;
    //     doc.text(`Email: ${userData.email}`, 20, y);
    //     y += lineSpacing;
    //     doc.text(`Amount Paid: ${userData.amountPaid}`, 20, y);
    //     y += lineSpacing;
    //     doc.text(`Transaction ID: ${userData.transactionId}`, 20, y);
    //     y += lineSpacing * 2; // Extra space before footer

    //     // Add Footer
    //     doc.setFontSize(10);
    //     doc.text("Thank you for your payment!", 20, y);
    //     y += lineSpacing;
    //     doc.text(`For any queries, contact ${userData.collegeName} Admission Office.`, 20, y);

    //     // Add a new page for student details
    //     doc.addPage();
    //     doc.setFont("helvetica", "bold");
    //     doc.setFontSize(16);
    //     doc.text("Student Information Form", 20, 20);

    //     doc.setFont("helvetica", "normal");
    //     doc.setFontSize(12);
    //     let y2 = 40; // Start position for second page

    //     // Personal Information
    //     doc.setFont("helvetica", "bold");
    //     doc.text("Personal Information", 20, y2);
    //     y2 += lineSpacing;
    //     doc.setFont("helvetica", "normal");
    //     doc.text(`Full Name: ${values.sfirstname} ${values.smiddlename} ${values.slastname}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Email: ${values.email}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Contact: ${values.contact}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Gender: ${values.gender}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Date of Birth: ${values.dob}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Place of Birth: ${values.placeofbirth}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Religion: ${values.religion}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Aadhar No: ${values.aadhar}`, 20, y2);
    //     y2 += lineSpacing * 2;

    //     // Parent Details
    //     doc.setFont("helvetica", "bold");
    //     doc.text("Parent Details", 20, y2);
    //     y2 += lineSpacing;
    //     doc.setFont("helvetica", "normal");
    //     doc.text(`Father: ${values.ffirstname} ${values.fmiddlename} ${values.flastname}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`Mother: ${values.mfirstname} ${values.mmiddlename} ${values.mlastname}`, 20, y2);
    //     y2 += lineSpacing * 2;

    //     // Examination Details
    //     doc.setFont("helvetica", "bold");
    //     doc.text("Examination Details", 20, y2);
    //     y2 += lineSpacing;
    //     doc.setFont("helvetica", "normal");

    //     doc.text(`SSC - Board: ${values.board}, Marks: ${values.marks}/${values.outOf}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`School Name: ${values.schoolName}, Year: ${values.passingYear}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`HSC - Board: ${values.hboard}, Marks: ${values.hmarks}/${values.houtOf}`, 20, y2);
    //     y2 += lineSpacing;
    //     doc.text(`College Name: ${values.hschoolName}, Year: ${values.hpassingYear}`, 20, y2);
    //     y2 += lineSpacing * 2;

    //     // Save and Download PDF
    //     doc.save(`${userData.name}_Admission_Receipt.pdf`);
    // }

    
    const downloadPdf = async (receiptId, trnId) => {
        const userData = {
            name: values.sfirstname,
            email: values.email,
            amountPaid: "₹100",
            transactionId: trnId,
            receiptId: receiptId,
            collegeName: 'Shri P.L.Shroff College'
        };
    
        // Generate PDF
        const doc = new jsPDF();
        
        // Add College Name and Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text(userData.collegeName, 20, 20);
        doc.setFontSize(14);
        doc.text("Admission Payment Receipt", 20, 40);
    
        // Student Details Table
        autoTable(doc, {
            startY: 50,
            head: [["Field", "Details"]],
            body: [
                ["Student Id", userData.receiptId],
                ["Name", userData.name],
                ["Email", userData.email],
                ["Amount Paid", userData.amountPaid],
                ["Transaction ID", userData.transactionId],
            ],
            theme: 'grid'
        });
    
        let finalY = doc.lastAutoTable.finalY + 10;
    
        // Add Footer
        doc.setFontSize(10);
        doc.text("Thank you for your payment!", 20, finalY);
        doc.text(`For any queries, contact ${userData.collegeName} Admission Office.`, 20, finalY + 10);
    
        // New Page for Student Information
        doc.addPage();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Student Information Form", 20, 20);
    
        // Personal Information Table
        autoTable(doc, {
            startY: 30,
            head: [["Field", "Details"]],
            body: [
                ["Full Name", `${values.sfirstname} ${values.smiddlename} ${values.slastname}`],
                ["Email", values.email],
                ["Contact", values.contact],
                ["Gender", values.gender],
                ["Date of Birth", values.dob],
                ["Place of Birth", values.placeofbirth],
                ["Religion", values.religion],
                ["Aadhar No", values.aadhar],
            ],
            theme: 'grid'
        });
    
        finalY = doc.lastAutoTable.finalY + 10;
    
        // Parent Details Table
        autoTable(doc, {
            startY: finalY,
            head: [["Parent", "First Name", "Middle Name", "Last Name"]],
            body: [
                ["Father", values.ffirstname, values.fmiddlename, values.flastname],
                ["Mother", values.mfirstname, values.mmiddlename, values.mlastname]
            ],
            theme: 'grid'
        });
    
        finalY = doc.lastAutoTable.finalY + 10;
    
        // Examination Details Table
        autoTable(doc, {
            startY: finalY,
            head: [["Exam", "Board", "Marks Obtained", "Out of", "Passing Year", "School/College Name"]],
            body: [
                ["SSC", values.board, values.marks, values.outOf, values.passingYear, values.schoolName],
                ["HSC", values.hboard, values.hmarks, values.houtOf, values.hpassingYear, values.hschoolName]
            ],
            theme: 'grid'
        });
    
        // Save and Download PDF
        doc.save(`${userData.name}_Admission_Receipt.pdf`);
    };

    const razorPayRes = async () => {
        const formData = {
            "firstname": values.sfirstname,
            "middlename": values.smiddlename,
            "lastname": values.slastname,
            "email": values.email,
            "contact": values.contact,
            "gender": values.gender,
            "address": values.address,
            "dob": values.dob,
            "place_of_birth": values.placeofbirth,
            "religion": values.religion,
            "aadhar": values.aadhar,
            "father": {
                "firstname": values.ffirstname,
                "middlename": values.fmiddlename,
                "lastname": values.flastname
            },
            "mother": {
                "firstname": values.mfirstname,
                "middlename": values.mmiddlename,
                "lastname": values.mlastname
            },
            "examination_details": {
                "ssc": {
                    "board": values.board,
                    "cert_no": values.certNo,
                    "seat_no": values.seatNo,
                    "marks": values.marks,
                    "out_of": values.outOf,
                    "passingYear": values.passingYear,
                    "school_name": values.schoolName,
                    "isQualified": values.qualified === 'Yes' ? true : false
                },
                "hsc": {
                    "board": values.hboard,
                    "cert_no": values.hcertNo,
                    "seat_no": values.hseatNo,
                    "marks": values.hmarks,
                    "out_of": values.houtOf,
                    "passingYear": values.hpassingYear,
                    "school_name": values.hschoolName,
                    "isQualified": values.hqualified === 'Yes' ? true : false

                }
            }

        };
        const orderData = await createOrder(10000, values.aadhar.slice(-4));
        console.log(orderData.order.id);
        const options = {
            key: "rzp_test_HunzwROOPkKw4u", // Replace with your Razorpay Key ID
            amount: orderData.order.amount,
            currency: "INR",
            name: "Your Company",
            description: "Test Transaction",
            order_id: orderData.order.id,
            handler: async function (response) {
                alert("Payment Successful!");
                console.log(response); const formResponse = await submitForm(formData);
                if (formResponse.message === "Admission Form Submitted Successfully") {
                    downloadPdf(orderData.order.receipt, orderData.order.id);
                    localStorage.removeItem('redirect'); // Clear redirect path
                    localStorage.removeItem('formData'); // Clear form data after login
                    handleReset();
                }
                console.log(response);
            },
            prefill: {
                name: values.sfirstname,
                email: values.email,
                contact: values.contact,
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    }

    const handleReset = async () => {
        // razorPayRes();
        // downloadPdf(9545);
        setValues(initialValues);
        setFormKey(Date.now());
    };

    // Handle Signup
    const handleSubmit = async (e) => {
        if (isAuthenticated) {
            e.preventDefault(); // Prevent default form submission
            setLoading(true);
            try {
                console.log(values.qualified);
                razorPayRes();
            } catch (err) {
                toast.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            // Store current page before redirecting
            console.log(location.pathname);
            localStorage.setItem('redirect', location.pathname);
            localStorage.setItem('formData', JSON.stringify(values));
            navigate('/login');
        }
    };
    return (
        <div className='adm-container'>
            <h1>Admission Form</h1>

            <form key={formKey} onSubmit={handleSubmit}>
                {<label style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>Personal Details*</label>}
                <hr className="adm-hr" />

                {<label style={{ paddingTop: '10px' }}>Name of the Student</label>}
                <div className='adm-one'>
                    <div>
                        {renderTextInput("First Name", 'sfirstname', "First Name")}
                    </div>
                    <div>
                        {renderTextInput("Middle Name", 'smiddlename', "Middle Name")}
                    </div>
                    <div>
                        {renderTextInput("Last Name", 'slastname', "Last Name")}
                    </div>

                </div>
                {<label >Father's/Husband's Name</label>}
                <div className='adm-one'>

                    <div>
                        {renderTextInput("First Name", 'ffirstname', "First Name")}
                    </div>
                    <div>
                        {renderTextInput("Middle Name", 'fmiddlename', "Middle Name")}
                    </div>
                    <div>
                        {renderTextInput("Last Name", 'flastname', "Last Name")}
                    </div>

                </div>

                {<label >Mother's Name</label>}
                <div className='adm-one'>

                    <div>
                        {renderTextInput("First Name", 'mfirstname', "First Name")}
                    </div>
                    <div>
                        {renderTextInput("Middle Name", 'mmiddlename', "Middle Name")}
                    </div>
                    <div>
                        {renderTextInput("Last Name", 'mlastname', "Last Name")}
                    </div>

                </div>

                <div className='adm-one'>
                    <div>
                        <label>Date of Birth</label>
                        <input value={values.dob} placeholder='DOB' className='adm-input' type='date' name='dob' onChange={handleChanges} required />
                    </div>
                    <div >
                        <label>Gender</label>
                        <div className="radio-group">
                            <input checked={values.gender === "Male"} className='adm-input' type='radio' name='gender' value="Male" onChange={handleChanges} required /> Male
                            <input checked={values.gender === "Female"} className='adm-input' type='radio' name='gender' value="Female" onChange={handleChanges} /> Female
                            <input checked={values.gender === "Other"} className='adm-input' type='radio' name='gender' value="Other" onChange={handleChanges} /> Other
                        </div>

                    </div>
                </div>

                <div className='adm-one'>
                    <div>
                        <label>Religion</label>
                        {renderTextInput("Religion", 'religion', "Religion")}
                    </div>
                    <div>
                        <label>Place of Birth</label>
                        {renderTextInput("Place of Birth", 'placeofbirth', "Place of Birth")}
                    </div>

                </div>

                <div className='adm-one'>

                    <div>
                        <label>Adhaar Card</label>
                        {renderTextInput("Adhaar Card", 'aadhar', "Aadhar No")}
                    </div>
                    <div>
                        <label>Mobile No</label>
                        {renderTextInput("Mobile No", 'contact', "Mobile No")}
                    </div>
                    <div>
                        <label>Email</label>
                        {renderTextInput("Email", 'email', "Email")}
                    </div>

                </div>

                <div >
                    <label>Address</label>
                    <textarea value={values.address} className='adm-input' name='address' id='address' cols='30' rows='3' placeholder='Address' onChange={handleChanges} />
                </div>

                {<label style={{ fontSize: 18, color: 'black', paddingTop: '10px', textAlign: 'center' }}>Educational Details*</label>}
                <hr className="adm-hr" />

                <label>SSC</label>
                <div className='adm-one'>
                    <div>
                        {renderTextInput("Board/University", 'board', "Board/University")}
                    </div>
                    <div>
                        {renderTextInput("Name of School/College", 'schoolName', "Name of School/College")}
                    </div>
                    <div>
                        <select
                            className="adm-input"
                            name="passingYear"
                            value={values.passingYear}
                            onChange={handleChanges}
                            required
                        >
                            <option value="">-- Select Year of passing --</option>
                            {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='adm-one' style={{ paddingBottom: '12px' }}>
                    <div>
                        {renderTextInput("Seat No", 'seatNo', "Examination Seat No")}
                    </div>
                    <div>
                        {renderTextInput("Degree/Passing Cert No", 'certNo', "Degree/Passing Cert No")}
                    </div>

                </div>

                <div className='adm-one'>
                    <div>
                        {renderTextInput("Grade/Total Marks Obtained", 'marks', "Grade/Total Marks Obtained")}
                    </div>

                    <div>
                        {renderTextInput("Out of", 'outOf', "Out of")}
                    </div>

                    <div>
                        <select
                            className="adm-input"
                            name="qualified"
                            value={values.qualified}
                            onChange={handleChanges}
                            required
                        >
                            <option value="">-- Qualifying Examination? (YES/NO) --</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                <label>HSC</label>
                <div className='adm-one'>
                    <div>
                        {renderTextInput("Board/University", 'hboard', "Board/University")}
                    </div>
                    <div>
                        {renderTextInput("Name of School/College", 'hschoolName', "Name of School/College")}
                    </div>
                    <div>
                        <select
                            className="adm-input"
                            name="hpassingYear"
                            value={values.hpassingYear}
                            onChange={handleChanges}
                            required
                        >
                            <option value="">-- Select Year of passing --</option>
                            {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='adm-one' style={{ paddingBottom: '12px' }}>
                    <div>
                        {renderTextInput("Seat No", 'hseatNo', "Examination Seat No")}
                    </div>
                    <div>
                        {renderTextInput("Degree/Passing Cert No", 'hcertNo', "Degree/Passing Cert No")}
                    </div>

                </div>

                <div className='adm-one'>
                    <div>
                        {renderTextInput("Grade/Total Marks Obtained", 'hmarks', "Grade/Total Marks Obtained")}
                    </div>

                    <div>
                        {renderTextInput("Out of", 'houtOf', "Out of")}
                    </div>

                    <div>
                        <select
                            className="adm-input"
                            name="hqualified"
                            value={values.hqualified}
                            onChange={handleChanges}
                            required
                        >
                            <option value="">-- Qualifying Examination? (YES/NO) --</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>

                <div className='button-container'>
                    <button className='adm-button' type='button' onClick={handleReset}>Reset</button>
                    <button className='adm-button' type='submit'>{loading ? 'please wait...' : 'Pay & Submit'}</button>
                </div>


                <hr className="adm-hr" />

                {<label style={{ fontSize: 14, color: 'gray', textAlign: 'center' }}>Note: course applied (e.g. BMS /B.Sc.IT/ M.A.Marathi / M.A.Hindi /M.Com / B.Sc.) Course Part applied for (e.g. Part 1/2/3/4)</label>}

            </form>
        </div >


    )
}

export default AdmissionForm
