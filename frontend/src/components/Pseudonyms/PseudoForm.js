import React, { useState } from "react";
import { editPseudonym, createPseudonym} from "../../store/pseudonyms";
import { useDispatch } from "react-redux";

export default function PseudoForm({pseudo, onClose}) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(pseudo?pseudo.firstName:"");
  const [middleName, setMiddleName] = useState(pseudo?pseudo.middleName:"");
  const [lastName, setLastName] = useState(pseudo?pseudo.lastName:"");
  const [isActive, setIsActive] = useState(pseudo?pseudo.isActive:false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pseudo) {
      setErrors([]);
      dispatch(editPseudonym({...pseudo, firstName, middleName, lastName, isActive }))
        .then(res =>{
          if (res.data && !res.data.errors) onClose();
        })
        .catch(res => {
          if (res.data && res.data.errors) setErrors(res.data.errors);
        });
    } else {
      dispatch(createPseudonym({ firstName, middleName, lastName, isActive }))
        .then(res =>{
          if (res.data && !res.data.errors) onClose();
        })
        .catch(res => {
          if (res.data && res.data.errors) setErrors(res.data.errors);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{pseudo?"Edit":"Create new"}{` pseudonym`}</h3>
      <ul style={errors.length?{}:{display: "none"}}>
        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
      </ul>
      <div>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="First Name"
        />
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          placeholder="Middle Name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Last Name"
        />
        <label onClick={()=>{setIsActive(!isActive)}}>
          {!isActive && <><i className="far fa-user"></i>{` Don't use as my identity`}</>}
          {isActive && <><i className="fas fa-user"></i>{` Use to introduce myself`}</>}
          </label>
      </div>
      <button type="submit">{pseudo?"Save changes":"Create pseudonym"}</button>
    </form>
  );
}
