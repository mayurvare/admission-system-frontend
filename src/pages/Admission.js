import React, { useState } from 'react';
import '../../src/styles/admission.css'

const initialValues = {
    sfirstname: "",
    smiddlename: "",
    slastname: "",
    email: "",
    contact: "",
    gender: "",
    course: "",
    result: null,
    url: "",
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
                maxLength={name === 'contact' ? 10 : name === 'aadhar' ? 12 : 20}
                required
            />
        </div>
    );

    const handleReset = () => {
        setValues(initialValues);
        setFormKey(Date.now());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(values);
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
                        <input placeholder='DOB' className='adm-input' type='date' name='dob' onChange={handleChanges} required />
                    </div>
                    <div >
                        <label>Gender</label>
                        <div className="radio-group">
                            <input className='adm-input' type='radio' name='gender' value="Male" onChange={handleChanges} required /> Male
                            <input className='adm-input' type='radio' name='gender' value="Female" onChange={handleChanges} /> Female
                            <input className='adm-input' type='radio' name='gender' value="Other" onChange={handleChanges} /> Other
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
                    <textarea className='adm-input' name='address' id='address' cols='30' rows='3' placeholder='Address' onChange={handleChanges} />
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
                            value={values.year}
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
                            value={values.agreement}
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
                            value={values.year}
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
                            value={values.agreement}
                            onChange={handleChanges}
                            required
                        >
                            <option value="">-- Qualifying Examination? (YES/NO) --</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>


                <button className='adm-button' type='button' onClick={handleReset}>Reset</button>
                <button className='adm-button' type='submit'>Submit</button>

                <hr className="adm-hr" />

                {<label style={{ fontSize: 14, color: 'gray', textAlign: 'center' }}>Note: course applied (e.g. BMS /B.Sc.IT/ M.A.Marathi / M.A.Hindi /M.Com / B.Sc.) Course Part applied for (e.g. Part 1/2/3/4)</label>}

            </form>
        </div >


    )
}

export default AdmissionForm
