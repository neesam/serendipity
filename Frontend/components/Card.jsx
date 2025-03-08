import { useState } from 'react';

import { View } from 'react-native';

import React from 'react';

import Card from "react-native";
import Button from "react-native";
import Modal from 'react-native'
import Form from 'react-bootstrap/Form'
import Picker from 'react-native-picker';


const EntCard = ({ 
        clickFunction, 
        deleteFunction, 
        addToCirculation, 
        addToQueue, 
        attributes, 
        submitTablesForm,
        setEntry
    }) => {
        
    const [showTablesModal, setShowTablesModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(""); // State for dropdown selection
    const [showTableItemsModal, setShowTableItemsModal] = useState(false)
    const [activeTable, setActiveTable] = useState(null)
    const [activeTableEntries, setActiveTableEntries] = useState([])

    const handleTablesModalOpen = () => setShowTablesModal(true);

    const handleTablesModalHide = () => setShowTablesModal(false)

    const handleTablesModalClose = () => {
        if (selectedOption) {
            submitTablesForm(selectedOption);
        }
        setShowTablesModal(false);
    }

    const handleTableItemsModalOpen = async (table) => {
        setActiveTable(table)

        if(table.includes('album') || table.includes('artist')) {
            try {
                const response = await fetch(`http://localhost:5001/api/all_from_selected_music_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else if(table.includes('film')) {
            try {
                const response = await fetch(`http://localhost:5001/api/all_from_selected_film_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else if(table.includes('anime') || table === 'shows') {
            try {
                const response = await fetch(`http://localhost:5001/api/all_from_selected_shows_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const response = await fetch(`http://localhost:5001/api/all_from_selected_book_table/${table}`)
                const data = await response.json()
                setActiveTableEntries(data)
            } catch (error) {
                console.log(error)
            }
        }
        setShowTableItemsModal(true)
    }

    const handleTableItemsModalHide = async () => {
        setSelectedOption(null)
        setShowTableItemsModal(false)
    }

    const handleDeleteFromTable = async () => {
        if(selectedOption) {
            if(activeTable.includes('album') || activeTable.includes('artist')) {
                try {
                    const response = await fetch(`http://localhost:5001/api/delete_from_music_table/${activeTable}/${selectedOption}`, {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json' },
                    });

                    console.log(response)
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }
        
                    console.log(await response.json());
                    console.log('Deleted successfully.');
                    
                } catch (error) {
                    console.error('Error during deletion:', error.message);
                }
            } else if(activeTable.includes('film')) {
                try {
                    const response = await fetch(`http://localhost:5001/api/delete_from_film_table/${activeTable}/${selectedOption}`, {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json' },
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }
        
                    console.log(await response.json());
                    console.log('Deleted successfully.');
                    
                } catch (error) {
                    console.error('Error during deletion:', error.message);
                }
            } else if(activeTable.includes('anime') || activeTable === 'shows') {
                try {
                    const response = await fetch(`http://localhost:5001/api/delete_from_shows_table/${activeTable}/${selectedOption}`, {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json' },
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }
        
                    console.log(await response.json());
                    console.log('Deleted successfully.');
                    
                } catch (error) {
                    console.error('Error during deletion:', error.message);
                }
            } else {
                try {
                    const response = await fetch(`http://localhost:5001/api/delete_from_book_table/${activeTable}/${selectedOption}`, {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/json' },
                    });
            
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Delete failed: ${errorData.message || 'Unknown error'}`);
                    }
        
                    console.log(await response.json());
                    console.log('Deleted successfully.');
                    
                } catch (error) {
                    console.error('Error during deletion:', error.message);
                }
            }
        }

        setShowTableItemsModal(false)
    }

    const handleSetEntryOnCard = async () => {
        if(selectedOption) {
            setEntry(selectedOption.title)
            localStorage.setItem('album', selectedOption.title)
            localStorage.setItem('original_album_table', selectedOption.original_table)
            localStorage.setItem('albumID', selectedOption.id)
            localStorage.setItem('in_circulation', selectedOption.in_circulation)
        }

        handleTableItemsModalHide()
    }

    const handleOptionChange = (e) => {
        const selectedEntry = activeTableEntries.find(entry => entry.id === e.target.value);
        setSelectedOption(selectedEntry);  
    };

    const handleTableSelectionOptionChange = (event) => setSelectedOption(event.target.value);


    function toGoogleSearchQuery(query) {
        // Encode the string to make it URL safe
        return 'https://www.google.com/search?q=' + encodeURIComponent(query);
    }

    return (
        <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '25vh',
            backgroundColor: attributes.color 
        }}>
            <Card style={{
                width: '50vw',
                margin: '50px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative' 
            }}>
                {attributes.type !== 'book' ? (
                    <Button
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: 1
                        }}
                        variant="outline-secondary"
                        onClick={handleTablesModalOpen}>
                        &#9998; 
                    </Button>
                ) : <></>}

                <Button
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        zIndex: 1
                    }}
                    variant="outline-info"
                    onClick={addToQueue}>
                    &#43; 
                </Button>

                <Card.Body>
                    {attributes.title ?  (
                        <Card.Title>
                        {attributes.title.includes('https://') ? (
                            <Text
                                target='_blank' 
                                style={{
                                    textDecoration: 'none', 
                                    color: 'black'
                                }} 
                                href={attributes.title} 
                                rel="noreferrer">
                                    Placeholder
                            </Text>
                        ) : 
                        <Text 
                            target='_blank' 
                            style={{
                                textDecoration: 'none', 
                                color: 'black'
                            }} 
                            href={toGoogleSearchQuery(attributes.title)} 
                            rel="noreferrer">
                                {attributes.title}
                        </Text>}
                    </Card.Title>
                    ) : <></>}
                    <Card.Title style={{fontSize: '10px'}}><a onClick={() => handleTableItemsModalOpen(attributes.table)}>{attributes.table}</a></Card.Title>
                </Card.Body>
                <View>
                    <Button
                        style={{ marginLeft: '5%', marginRight: '5%', marginBottom: '3%' }}
                        onClick={clickFunction}>
                        Get {attributes.type}
                    </Button>
                    <Button
                        style={{ marginRight: '5%', marginBottom: '3%' }}
                        variant='danger'
                        onClick={deleteFunction}>
                        Delete {attributes.type}
                    </Button>
                    {attributes.type === 'album' && attributes.inCirculation === 'false' ? (
                        <Button
                        style={{ marginRight: '5%', marginBottom: '3%' }}
                        variant='light'
                        onClick={addToCirculation}>
                        Add to inCirculation
                    </Button>
                    ) : <></>}
                </View>
            </Card>

            {attributes.type !== 'book' ? (
                <Modal show={showTablesModal} onHide={handleTablesModalHide}>
                <Modal.Header closeButton>
                    {attributes.type === 'album' ? (
                        <Modal.Title>
                        Get an {attributes.type} from a specific table
                        </Modal.Title>
                    ) : 
                        <Modal.Title>
                        Get a {attributes.type} from a specific table
                        </Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                {/* <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="javascript" />
                    <Picker.Item label="Python" value="python" />
                </Picker> */}
                {/* <Form>
                        <Form.Group controlId="formDropdown">
                            <Form.Label>Choose an Option</Form.Label>
                            <Form.Control as="select" value={selectedOption} onChange={handleTableSelectionOptionChange}>
                                <option value="">-- Select an option --</option>
                                {attributes.tables.map((table, index) => (
                                    <option key={index} value={table}>
                                        {table}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleTablesModalHide}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleTablesModalClose}>
                        Get {attributes.type}
                    </Button>
                </Modal.Footer>
            </Modal>
            ) : <></>}

            <Modal show={showTableItemsModal} onHide={handleTableItemsModalHide}>
                <Modal.Header closeButton>
                        <Modal.Title>
                            All entries from {activeTable}
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {/* <Form>
                        <Form.Group controlId="formDropdown">
                            <Form.Label>Choose an Option</Form.Label>
                            <Form.Control as="select" value={selectedOption ? selectedOption.id : ""} onChange={handleOptionChange}>
                                <option value="">-- Select an option --</option>
                                {activeTableEntries.map((entry) => (
                                    <option key={entry.id} value={entry.id}>
                                        {entry.title}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form> */}
                </Modal.Body>
                <Modal.Footer>
                    {selectedOption ? (
                        <Button variant="primary" onClick={handleSetEntryOnCard}>
                            Set
                        </Button>
                    ) : <></>}
                    {selectedOption ? (
                        <Button variant="danger" onClick={handleDeleteFromTable}>
                            Delete
                        </Button>
                    ) : <></>}
                </Modal.Footer>
            </Modal>
        </View>
    );
};

export default EntCard;