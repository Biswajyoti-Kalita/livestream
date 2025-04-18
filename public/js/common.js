function clearFieldData(fieldID){
    const field = document.getElementById(fieldID);
    if(field)
        field.value = "";
}