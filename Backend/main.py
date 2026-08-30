import pyvisa

rm = pyvisa.ResourceManager("daq6510/sim/daq6510_sim.yaml@sim")

print(rm.list_resources())

# TODO: otwórz zasób (open_resource) i wyślij zapytanie *IDN?