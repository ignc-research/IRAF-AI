from __future__ import annotations
from enum import Enum
from typing import TypedDict, Union, Dict

class ParameterType(Enum):
    INT = 1
    FLOAT = 2
    STRING = 3
    BOOLEAN = 4

class ConfigParameter(TypedDict):
    type: ParameterType
    multiple: Union[bool, int]
    value: Union[None, float, int, str]    
    children: Union[None, ConfigParameters]

class ConfigParameters(Dict[str, ConfigParameter]):
    pass
