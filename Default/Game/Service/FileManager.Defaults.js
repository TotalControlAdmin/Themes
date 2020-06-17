function configureFileManagerDefaults(filemanager) {
    //file details on by default
    filemanager.executeCommand({ command: "TogglePaneCommand", options: { type: "preview" } });
    filemanager.toolbar.fileManagerDetailsToggle.switchInstance.toggle();

    //grid view by default
    //filemanager.toolbar._groups.changeView.buttons[0].element.click();
}