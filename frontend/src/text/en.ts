export const en = {
    crumbs: {
        root: "DAQQS",
        dashboardPage: "Data Fetching",
        settingsPage: "Settings",
        dataTablePage: "Experiment Data",
        fittingsSettings: "Fittings Experiment Settings",
        fittingsDashboard: "Fittings Dashboard",
    },
    deviceSwitcher: {
        menuContentLabel: "Devices",
        addButtonLabel: "Add Device",
        contextMenu: {
            select: "Select",
            delete: "Delete",
            edit: "Edit",
            info: "Info",
        },
    },
    sidebarGroups: {
        daqs: "DAQS",
        fittings: "Fittings",
    },
    sidebarTabs: {
        experimentData: "Experiment Data",
        dashboardPage: "Dashboard",
        fittingsSettings: "Experiment Settings",
        fittings: "Fittings",
    },
    dashboardPage: {
        charts: {
            thermocouple_1: "Thermocouple 1",
            thermocouple_2: "Thermocouple 2",
            voltage: "Voltage",
        },
        dataKey: {
            dataKeyT1: "t1History",
            dataKeyT2: "t2History",
            dataKeyV: "voltageHistory",
        }
    },
    devicePage: {
        title: "Device Settings",
        description: "Manage hardware parameters and channels.",
        indSectionTitle: "Identification and Addressing",
        indSectionDescription: "Identifier representing the device and it's address",
        chanelMappingTitle: "Chanel Mapping",
        chanelMappingDescription: "Slot and channel number identifying where each sensor is physically connected.",
        iconLabel: "Icon",
        nameLabel: "Name",
        resourceAddress: "Resource Address",
        thermocouple_1: "Thermocouple 1",
        thermocouple_2: "Thermocouple 2",
        voltage: "Voltage",
        slot: "Slot",
        buttons: {
            edit: "Edit",
            save: "Save",
            cancel: "Cancel",
            add: "Add",
            delete: "Delete",
        }
    },
    dataTablePage: {
        table: {
            timeColumn: "Time",
            userColumn: "User",
            deviceColumn: "Device",
            thermocouple_1Column: "T1",
            thermocouple_2Column: "T2",
            voltageColumn: "Voltage",
        },
        filtering: {
            columnFiltering: "View",
            dataFiltering: "Filters",
            timeForm: "Time From",
            timeTo: "Time To",
            allDevices: "All devices",
            apply: "Apply",
            reset: "Reset",
            devicePlaceholder: "DAQ6510",
        },
        footer: {
            rowsPerPage: "Rows per page",
            pageOf: "of",
            rowSelected: "row(s) selected",
        }
    },
    toast: {
        deviceAdd: "Device added successfully",
        deviceUpdate: "Device updated",
        deviceDelete: "Device deleted",
        deviceDeleteFailed: "Device can not be deleted.",
        loadingError: "Failed to load data.",
    },
    fittingsSettingsPage: {
        PTRForwardModelsLabel: "PTR Forward",
        PTRForwardModelsDescription: "Available simulation models for photothermal radiometry signal calculation settings.",
        PTRConfigurationLabel: "PTR Configuration",
        PTRConfigurationDescription: "Fixed geometrical, thermal, and fitting parameters for the photothermal radiometry model.",

        dataFile: "Data .dat File",
        sampleName: "Sample name",
        numberOfStarts: "Number of Optimization Starts",
        l2: "Layer Thickness (L2)",
        k1: "Thermal Conductivity Layer 1 (K1)",
        l1: "Thickness of Layer 1 (L1)",
        alfa1: "Thermal Diffusivity Layer 1 (α1)",
        k3: "Thermal Conductivity Substrate (K3)",
        alfa3: "Thermal Diffusivity Substrate (α3)",
        r21: "Thermal Boundary Resistance (R21)",
        dPump: "Pump Beam Diameter",
        anisotropy: "Thermal Anisotropy Factor",
        q: "Heating Power (Q)",
        c2: "Volumetric Heat Capacity (ρC2)",

        ptGroup: {
            geometry: "Geometry",
            l1Params: "Layer 1 Parameters",
            l3Params: "Layer 3 Parameters",
            flowAndMaterial: "Flow and Material",
        },

        placeholders: {
            sampleName: "Sample-10.10.1010",
            numberOfStarts: 1,
            useBayesianOptimization: true,
            l2: 240e-9,
            k1: 150.0,
            l1: 50e-9,
            alfa1: 2.1e-5,
            k3: 1,
            alfa3: 0.5e-7,
            r21: 1.0e-8,
            dPump: 2.4e-6,
            anisotropy: 1.94,
            q: 1.0,
            c2: 1.3e-6,
        }
    },
    fittingsDashboardPage: {
        table: {
            timeColumn: "Time",
            anisotropyRatio: "Anisotropy Ratio",
            k2: "Thermal Conductivity",
            r32: "Thermal Boundary Resistance",
            k3: "Substrate Thermal Conductivity",
            kParallel: "Calculated In-plane Conductivity",
            r2Amp: "Amplitude Fit Goodness (R²)",
            r2Phase: "Phase Fit Goodness (R²)",
            resNorm: "Residual Norm",
        }
    }
};