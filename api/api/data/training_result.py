class TrainingResult:
    def __init__(self, log):
        self.log = log

    def to_dict(self):
        return { "log": self.log }


class PredictionLayer:
    def __init__(self, name, xml):
        self.name = name
        self.xml = xml
        
    def to_dict(self):
        return { "name": self.name, "xml": self.xml }