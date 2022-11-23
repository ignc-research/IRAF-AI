class PredictionResult:
    def __init__(self, name, log, layers):
        self.name = name
        self.log = log
        self.layers = layers

    def to_dict(self):
        return { "name": self.name, "log": self.log, "layers": list(map(lambda x: x.to_dict(), self.layers)) }


class PredictionLayer:
    def __init__(self, name, xml):
        self.name = name
        self.xml = xml
        
    def to_dict(self):
        return { "name": self.name, "xml": self.xml }