function Menu({ dropdownCheck, setDropdownChecked, handleCreateInventory, handleDeleteInventory, currentInventory, allInventories, setAllInventories, setCurrentInventory, handleDownload, handleUpload }) {
    return (
      <div className="modal menu">
        <h2 style={{margin: ".5rem 0", textAlign : "center"}}>Menu</h2>
        <button
          className="pure-button"
          onClick={() => {
            const newName = prompt("Nombre del nuevo inventario:");
            if (newName)
              handleCreateInventory(
                newName,
                allInventories,
                setAllInventories,
                setCurrentInventory
              );
          }}
        >
          Crear Inventario
        </button>
        {currentInventory !== "default" && (
          <button
            onClick={() =>
              handleDeleteInventory(
                currentInventory,
                allInventories,
                setAllInventories,
                setCurrentInventory
              )
            }
          >
            Eliminar Inventario
          </button>
        )}
        <button className="pure-button" onClick={handleDownload}>
          Exportar Inventarios
        </button>
  
        <button className="pure-button" onClick={handleUpload}>
          Importar Inventarios
        </button>
      </div>
    );
  }
  
  export default Menu;