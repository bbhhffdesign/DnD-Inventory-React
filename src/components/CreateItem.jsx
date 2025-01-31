import { useState } from "react";

export default function CreateItem({ setInventory, inventory, onClose }) {
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [copper, setCopper] = useState("");

  function handleInputChange(type, value) {
    if (type === "gold") {
      setGold(value);
      setSilver("");
      setCopper("");
    } else if (type === "silver") {
      setSilver(value);
      setGold("");
      setCopper("");
    } else if (type === "copper") {
      setCopper(value);
      setGold("");
      setSilver("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = Object.fromEntries(formData.entries());
    const category = item.category;

    // Determinar qué valor se usó
    let value = {};
    if (gold) value = { gold: parseFloat(gold) };
    else if (silver) value = { silver: parseFloat(silver) };
    else if (copper) value = { copper: parseInt(copper, 10) };

    const newItem = {
      ...item,
      weight: parseFloat(item.weight),
      quantity: parseInt(item.quantity, 10),
      value,
    };

    setInventory({
      [category]: [...(inventory[category] || []), newItem],
    });

    e.target.reset();
    setGold("");
    setSilver("");
    setCopper("");
    onClose();
  }

  return (
    <form
      className="pure-form pure-form-stacked modal additemform"
      onSubmit={handleSubmit}
      style={{ border: "solid 1px white", padding: "1rem" }}
    >
      <h2 style={{ margin: "0" }}>Crear Item</h2>
      <input type="text" name="name" placeholder="Nombre" required />
      <input type="text" name="description" placeholder="Descripción" required />
      <input name="weight" type="number" step="0.1" min="0" placeholder="Peso" required />
      <input name="quantity" min="1" type="number" placeholder="Cantidad" required />

      {/* Inputs separados para Gold, Silver y Copper */}
      
        <input 
        style={{backgroundColor: "#feb5238b"}}
          name="gold"
          type="number"
          step="0.01"
          min="0"
          placeholder="Oro (gp)"
          value={gold}
          onChange={(e) => handleInputChange("gold", e.target.value)}
        />
        <input 
        style={{backgroundColor: "#b1c8d980"}}
          name="silver"
          type="number"
          step="0.01"
          min="0"
          placeholder="Plata (pp)"
          value={silver}
          onChange={(e) => handleInputChange("silver", e.target.value)}
        />
        <input 
        style={{backgroundColor: "#cc690065"}}
          name="copper"
          type="number"
          step="1"
          min="0"
          placeholder="Cobre (cp)"
          value={copper}
          onChange={(e) => handleInputChange("copper", e.target.value)}
        />


      <select name="category">
        <option value="equipment">Equipamiento</option>
        <option value="consumables">Consumibles</option>
        <option value="crafting">Crafteo</option>
        <option value="quest">Misión</option>
        <option value="misc">Misceláneo</option>
      </select>

      <div className="modaladdmoney-buttons">
        <button className="pure-button" type="submit" style={{ margin: "0" }}>
          <img src="./src/assets/tick.png" alt="" />
        </button>
        <button className="pure-button" type="button" onClick={onClose}>
          <img src="./src/assets/x.png" alt="" />
        </button>
      </div>
    </form>
  );
}
